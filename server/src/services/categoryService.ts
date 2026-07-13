import { query } from '../utils/db';
import { AppError } from '../middlewares/errorHandler';
import type { Category } from '../types';

class CategoryService {
  async findAll() {
    const rows = await query(
      `SELECT c.*, (SELECT COUNT(*) FROM posts WHERE category_id = c.id) as post_count
       FROM categories c ORDER BY c.sort_order ASC`
    );
    return rows as Category[];
  }

  async findById(id: number) {
    const rows = await query('SELECT * FROM categories WHERE id = ?', [id]);
    const cat = (rows as any[])[0];
    if (!cat) throw new AppError('分类不存在', 404);
    return cat;
  }

  async create(data: { name: string; slug: string; description?: string; sort_order?: number }) {
    const result = await query(
      'INSERT INTO categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)',
      [data.name, data.slug, data.description || '', data.sort_order ?? 0]
    );
    return { id: (result as any).insertId };
  }

  async update(id: number, data: { name?: string; slug?: string; description?: string; sort_order?: number }) {
    const fields: string[] = [];
    const values: any[] = [];
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) { fields.push(`${key} = ?`); values.push(val); }
    }
    if (fields.length === 0) return;
    values.push(id);
    const result = await query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
    if ((result as any).affectedRows === 0) throw new AppError('分类不存在', 404);
  }

  async delete(id: number) {
    const result = await query('DELETE FROM categories WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) throw new AppError('分类不存在', 404);
  }

  async count() {
    const rows = await query('SELECT COUNT(*) as total FROM categories');
    return (rows as any[])[0].total;
  }
}

export const categoryService = new CategoryService();
