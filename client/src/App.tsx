import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BlogLayout from './layouts/BlogLayout.tsx';
import AdminLayout from './layouts/AdminLayout.tsx';
import Home from './pages/Home.tsx';
import PostDetail from './pages/PostDetail.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/admin/Dashboard.tsx';
import PostList from './pages/admin/PostList.tsx';
import PostEditor from './pages/admin/PostEditor.tsx';
import CategoryManager from './pages/admin/CategoryManager.tsx';
import CommentManager from './pages/admin/CommentManager.tsx';
import './App.css';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 博客前台 */}
        <Route element={<BlogLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Route>

        {/* 登录页 */}
        <Route path="/login" element={<Login />} />

        {/* 后台管理 */}
        <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<PostList />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/edit/:id" element={<PostEditor />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="comments" element={<CommentManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
