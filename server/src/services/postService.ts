import { query } from '../utils/db';
import { AppError } from '../middlewares/errorHandler';
import type { Post, CreatePostRequest, UpdatePostRequest } from '../types';

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
}

class PostService {
  async findAll(params: { page?: number; pageSize?: number; status?: string; category_id?: number; keyword?: string }) {
    const { page = 1, pageSize = 10, status, category_id, keyword } = params;
    const conditions: string[] = [];
    const values: any[] = [];

    if (status) { conditions.push('p.status = ?'); values.push(status); }
    if (category_id) { conditions.push('p.category_id = ?'); values.push(category_id); }
    if (keyword) { conditions.push('(p.title LIKE ? OR p.content LIKE ?)'); values.push(`%${keyword}%`, `%${keyword}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * pageSize;

    const [rows, countRows] = await Promise.all([
      query(
        `SELECT p.*, u.nickname as author_name, c.name as category_name
         FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN categories c ON p.category_id = c.id
         ${where} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
        [...values, pageSize, offset]
      ),
      query(`SELECT COUNT(*) as total FROM posts p ${where}`, values),
    ]);

    return { list: rows as Post[], total: (countRows as any[])[0].total, page, pageSize };
  }

  async findById(id: number) {
    const rows = await query(
      `SELECT p.*, u.nickname as author_name, c.name as category_name
       FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    const post = (rows as any[])[0];
    if (!post) throw new AppError('文章不存在', 404);
    return post;
  }

  async create(data: CreatePostRequest, authorId: number) {
    const slug = data.slug || generateSlug(data.title);
    const result = await query(
      `INSERT INTO posts (title, slug, content, summary, cover_image, author_id, category_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.title, slug, data.content, data.summary || '', data.cover_image || null, authorId, data.category_id || null, data.status]
    );
    return { id: (result as any).insertId, slug };
  }

  async update(id: number, data: UpdatePostRequest) {
    const fields: string[] = [];
    const values: any[] = [];
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) { fields.push(`${key} = ?`); values.push(val); }
    }
    if (fields.length === 0) return;
    values.push(id);
    const result = await query(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`, values);
    if ((result as any).affectedRows === 0) throw new AppError('文章不存在', 404);
  }

  async delete(id: number) {
    const result = await query('DELETE FROM posts WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) throw new AppError('文章不存在', 404);
  }

  async incrementViews(id: number) {
    await query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [id]);
  }

  async count(status?: string) {
    const rows = status
      ? await query('SELECT COUNT(*) as total FROM posts WHERE status = ?', [status])
      : await query('SELECT COUNT(*) as total FROM posts');
    return (rows as any[])[0].total;
  }

  async totalViews() {
    const rows = await query('SELECT SUM(view_count) as total FROM posts');
    return (rows as any[])[0].total || 0;
  }
}

export const postService = new PostService();
