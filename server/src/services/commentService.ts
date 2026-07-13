import { query } from '../utils/db';
import { AppError } from '../middlewares/errorHandler';
import type { Comment } from '../types';

class CommentService {
  async findByPostId(postId: number) {
    const rows = await query(
      `SELECT * FROM comments WHERE post_id = ? AND status = 'approved' ORDER BY created_at ASC`,
      [postId]
    );
    return rows as Comment[];
  }

  async findAll(params: { page?: number; pageSize?: number; status?: string }) {
    const { page = 1, pageSize = 20, status } = params;
    const where = status ? `WHERE c.status = '${status}'` : '';
    const offset = (page - 1) * pageSize;

    const [rows, countRows] = await Promise.all([
      query(
        `SELECT c.*, p.title as post_title FROM comments c LEFT JOIN posts p ON c.post_id = p.id
         ${where} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
        [pageSize, offset]
      ),
      query(`SELECT COUNT(*) as total FROM comments c ${where}`),
    ]);

    return { list: rows as Comment[], total: (countRows as any[])[0].total, page, pageSize };
  }

  async create(data: { post_id: number; parent_id?: number; author_name: string; author_email?: string; content: string }) {
    const result = await query(
      `INSERT INTO comments (post_id, parent_id, author_name, author_email, content) VALUES (?, ?, ?, ?, ?)`,
      [data.post_id, data.parent_id || null, data.author_name, data.author_email || null, data.content]
    );
    return { id: (result as any).insertId };
  }

  async updateStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
    const result = await query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
    if ((result as any).affectedRows === 0) throw new AppError('评论不存在', 404);
  }

  async delete(id: number) {
    const result = await query('DELETE FROM comments WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) throw new AppError('评论不存在', 404);
  }

  async count(status?: string) {
    const rows = status
      ? await query('SELECT COUNT(*) as total FROM comments WHERE status = ?', [status])
      : await query('SELECT COUNT(*) as total FROM comments');
    return (rows as any[])[0].total;
  }
}

export const commentService = new CommentService();
