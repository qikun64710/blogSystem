import { useState, useEffect } from 'react';
import { categoriesApi } from '../../api';
import type { Category } from '../../types';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = () => {
    categoriesApi.getList().then(res => {
      if (res.data) setCategories(res.data);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await categoriesApi.update(editId, form);
        alert('分类更新成功');
      } else {
        await categoriesApi.create(form);
        alert('分类创建成功');
      }
      setForm({ name: '', slug: '', description: '' });
      setEditId(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || '操作失败');
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' });
    setEditId(cat.id);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除分类「${name}」吗？`)) return;
    try {
      await categoriesApi.delete(id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || '删除失败');
    }
  };

  const handleCancel = () => {
    setForm({ name: '', slug: '', description: '' });
    setEditId(null);
  };

  return (
    <div>
      <div className="editor-card" style={{ marginBottom: 'var(--space-8)' }}>
        <h3 className="editor-title">{editId ? '编辑分类' : '新建分类'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label>名称</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="分类名称"
                required
              />
            </div>
            <div className="form-group">
              <label>别名</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="英文标识，如 tech"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>描述</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="分类描述（选填）"
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button type="submit" className="btn btn-primary">{editId ? '更新' : '创建'}</button>
            {editId && <button type="button" className="btn btn-secondary" onClick={handleCancel}>取消</button>}
          </div>
        </form>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>别名</th>
              <th>描述</th>
              <th>文章数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>暂无分类</td></tr>
            )}
            {categories.map(cat => (
              <tr key={cat.id}>
                <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{cat.name}</td>
                <td><code style={{ fontSize: 'var(--text-xs)' }}>{cat.slug}</code></td>
                <td>{cat.description || '—'}</td>
                <td>{cat.post_count}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-secondary" onClick={() => handleEdit(cat)}>编辑</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(cat.id, cat.name)}>删除</button>
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
