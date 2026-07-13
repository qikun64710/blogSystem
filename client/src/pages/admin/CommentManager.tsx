import { useState, useEffect } from 'react';
import { commentsApi } from '../../api';
import type { Comment } from '../../types';

export default function CommentManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => { fetchComments(); }, [filter]);

  const fetchComments = () => {
    const params: Record<string, string | number> = { pageSize: 100 };
    if (filter) params.status = filter;
    commentsApi.getList(params).then(res => {
      if (res.data) {
        setComments(res.data.list || []);
        setTotal(res.data.total);
      }
    });
  };

  const handleStatusChange = async (id: number, status: Comment['status']) => {
    try {
      await commentsApi.updateStatus(id, status);
      fetchComments();
    } catch (err: any) {
      alert(err.message || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条评论吗？')) return;
    try {
      await commentsApi.delete(id);
      fetchComments();
    } catch (err: any) {
      alert(err.message || '删除失败');
    }
  };

  const statusLabel: Record<string, string> = {
    approved: '已通过',
    pending: '待审核',
    rejected: '已拒绝'
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
        {[
          { key: '', label: '全部' },
          { key: 'pending', label: '待审核' },
          { key: 'approved', label: '已通过' }
        ].map(item => (
          <button
            key={item.key}
            className={`btn ${filter === item.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(item.key)}
          >
            {item.label} {item.key === filter ? `(${total})` : ''}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>文章</th>
              <th>评论者</th>
              <th>内容</th>
              <th>状态</th>
              <th>时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>暂无评论</td></tr>
            )}
            {comments.map(comment => (
              <tr key={comment.id}>
                <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {comment.post_title || '—'}
                </td>
                <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{comment.author_name}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {comment.content}
                </td>
                <td>
                  <span className={`badge badge-${comment.status}`}>
                    {statusLabel[comment.status] || comment.status}
                  </span>
                </td>
                <td>{new Date(comment.created_at).toLocaleDateString('zh-CN')}</td>
                <td>
                  <div className="actions">
                    {comment.status !== 'approved' && (
                      <button className="btn btn-secondary" onClick={() => handleStatusChange(comment.id, 'approved')}>通过</button>
                    )}
                    {comment.status !== 'rejected' && (
                      <button className="btn btn-ghost" onClick={() => handleStatusChange(comment.id, 'rejected')}>拒绝</button>
                    )}
                    <button className="btn btn-danger" onClick={() => handleDelete(comment.id)}>删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
