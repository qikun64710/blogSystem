import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../api';
import type { Post } from '../../types';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const [published, drafts] = await Promise.all([
        postsApi.getList({ pageSize: 100, status: 'published' }),
        postsApi.getList({ pageSize: 100, status: 'draft' })
      ]);
      const all = [...(published.data?.list || []), ...(drafts.data?.list || [])];
      setPosts(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`确定要删除「${title}」吗？此操作不可撤销。`)) return;
    try {
      await postsApi.delete(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || '删除失败');
    }
  };

  if (loading) return <div className="empty-state"><p>加载中...</p></div>;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/admin/posts/new" className="btn btn-primary">+ 新建文章</Link>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>分类</th>
              <th>状态</th>
              <th>浏览</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-12)' }}>暂无文章</td></tr>
            )}
            {posts.map(post => (
              <tr key={post.id}>
                <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{post.title}</td>
                <td>{post.category_name || '—'}</td>
                <td>
                  <span className={`badge badge-${post.status}`}>
                    {post.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td>{post.view_count}</td>
                <td>{new Date(post.created_at).toLocaleDateString('zh-CN')}</td>
                <td>
                  <div className="actions">
                    <Link to={`/admin/posts/edit/${post.id}`} className="btn btn-secondary">编辑</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(post.id, post.title)}>删除</button>
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
