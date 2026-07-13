import mysql from 'mysql2/promise';
import { config } from '../config';
import bcrypt from 'bcryptjs';

let pool: mysql.Pool;

export async function getPool(): Promise<mysql.Pool> {
  if (pool) return pool;

  // 先创建无数据库的连接来初始化
  const initConn = await mysql.createConnection({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
  });

  await initConn.execute(
    `CREATE DATABASE IF NOT EXISTS \`${config.mysql.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await initConn.end();

  pool = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await initDatabase();
  return pool;
}

async function initDatabase() {
  const p = await getPoolRef();

  await p.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nickname VARCHAR(100) NOT NULL DEFAULT '',
      avatar VARCHAR(500) DEFAULT NULL,
      email VARCHAR(100) DEFAULT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      slug VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      slug VARCHAR(200) NOT NULL UNIQUE,
      content LONGTEXT NOT NULL,
      summary TEXT,
      cover_image VARCHAR(500) DEFAULT NULL,
      author_id INT NOT NULL,
      category_id INT DEFAULT NULL,
      status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
      view_count INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      parent_id INT DEFAULT NULL,
      author_name VARCHAR(50) NOT NULL,
      author_email VARCHAR(100) DEFAULT NULL,
      content TEXT NOT NULL,
      status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

// 内部获取 pool 引用（初始化后调用）
async function getPoolRef(): Promise<mysql.Pool> {
  if (pool) return pool;
  throw new Error('Pool not initialized');
}

/* ========== Seed 默认数据 ========== */
export async function seedDefaults() {
  const p = await getPoolRef();

  const [rows] = await p.execute('SELECT id FROM users WHERE username = ?', ['admin']);
  if ((rows as any[]).length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await p.execute(
      'INSERT INTO users (username, password, nickname, role) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, '管理员', 'admin']
    );
    console.log('✓ 默认管理员账号已创建 (admin / admin123)');
  }

  const [catRows] = await p.execute('SELECT COUNT(*) as count FROM categories');
  if ((catRows as any[])[0].count === 0) {
    const defaults = [
      ['技术', 'tech', '技术相关文章', 1],
      ['生活', 'life', '生活随笔', 2],
      ['前端', 'frontend', '前端开发', 3],
      ['后端', 'backend', '后端开发', 4],
    ];
    for (const [name, slug, desc, sort] of defaults) {
      await p.execute(
        'INSERT INTO categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)',
        [name, slug, desc, sort]
      );
    }
    console.log('✓ 默认分类已创建');
  }
}

export async function query(sql: string, params?: any[]): Promise<any> {
  const p = await getPool();
  const [result] = await p.execute(sql, params);
  return result;
}
