import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { postsApi, categoriesApi } from '../../api';
import type { Post, Category } from '../../types';

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '', content: '', summary: '', cover_image: '', category_id: '' as string | number, status: 'published' as Post['status']
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    categoriesApi.getList().then(res => {
      if (res.data) setCategories(res.data);
    });
    if (isEdit && id) {
      postsApi.getById(Number(id)).then(res => {
        const post = res.data;
        if (post) {
          setForm({
            title: post.title || '',
            content: post.content || '',
            summary: post.summary || '',
            cover_image: post.cover_image || '',
            category_id: post.category_id || '',
            status: post.status || 'published'
          });
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        category_id: form.category_id ? Number(form.category_id) : null,
        cover_image: form.cover_image || null,
        summary: form.summary || undefined,
      };
      if (isEdit && id) {
        await postsApi.update(Number(id), data);
        alert('文章更新成功');
      } else {
        await postsApi.create(data);
        alert('文章创建成功');
      }
      navigate('/admin/posts');
    } catch (err: any) {
      alert(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-card">
      <h2 className="editor-title">{isEdit ? '编辑文章' : '新建文章'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>标题</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="输入文章标题"
            required
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
          <div className="form-group">
            <label>分类</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">选择分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>状态</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Post['status'] })}>
              <option value="published">发布</option>
              <option value="draft">草稿</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>摘要</label>
          <input
            type="text"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="简短描述文章内容（选填）"
          />
        </div>
        <div className="form-group">
          <label>封面图片 URL</label>
          <input
            type="text"
            value={form.cover_image}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ marginBottom: 0 }}>正文内容 (Markdown)</label>
            <button type="button" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '13px' }} onClick={() => setPreview(!preview)}>
              {preview ? '编辑' : '预览'}
            </button>
          </div>
          {preview ? (
            <div className="markdown-body" style={{ minHeight: '300px', padding: 'var(--space-5)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: '#fff' }}>
              {form.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
              ) : (
                <p style={{ color: 'var(--sage)' }}>暂无内容</p>
              )}
            </div>
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="用 Markdown 格式写下你的文章...&#10;&#10;示例：&#10;# 一级标题&#10;## 二级标题&#10;**粗体** *斜体*&#10;- 列表项"
              required
              style={{ minHeight: '300px' }}
            />
          )}
        </div>
        <div className="editor-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '保存中...' : (isEdit ? '更新文章' : '创建文章')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/posts')}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
