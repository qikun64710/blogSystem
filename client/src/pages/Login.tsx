import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi.login(form.username, form.password);
      if (res.code === 0) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/admin');
      } else {
        setError(res.message || '登录失败');
      }
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">欢迎回来</h2>
        <p className="login-subtitle">登录以管理你的博客内容</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>用户名</label>
            <input
              type="text"
              placeholder="输入用户名"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label>密码</label>
            <input
              type="password"
              placeholder="输入密码"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '14px' }}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <p className="login-hint">默认账号: admin / admin123</p>
      </div>
    </div>
  );
}
