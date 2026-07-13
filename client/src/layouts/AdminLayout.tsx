import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../types';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user: User = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return '仪表盘';
    if (path.includes('/posts/new') || path.includes('/posts/edit')) return '文章编辑';
    if (path.includes('/posts')) return '文章管理';
    if (path.includes('/categories')) return '分类管理';
    if (path.includes('/comments')) return '评论管理';
    return '管理后台';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Ink<span>.</span>Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={isActive('/admin')}>仪表盘</Link>
          <Link to="/admin/posts" className={isActive('/admin/posts')}>文章管理</Link>
          <Link to="/admin/categories" className={isActive('/admin/categories')}>分类管理</Link>
          <Link to="/admin/comments" className={isActive('/admin/comments')}>评论管理</Link>
          <Link to="/" target="_blank">查看博客</Link>
        </nav>
      </aside>
      <div className="admin-content">
        <div className="admin-header">
          <h1>{getPageTitle()}</h1>
          <div className="admin-user">
            <span className="admin-user-name">{user.nickname || user.username || '管理员'}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>退出</button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
