import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function BlogLayout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide nav on home (hero covers it), show on scroll
  const isHome = location.pathname === '/';

  return (
    <div>
      <nav className={`blog-nav-bar ${scrolled || !isHome ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          Ink<span>.</span>Blog
        </Link>
        <div className="nav-links">
          <Link to="/">首页</Link>
          <Link to="/login">管理</Link>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          &copy; 2026 Ink.Blog — 用文字记录思考
        </div>
        <div className="site-footer-links">
          <Link to="/login">管理后台</Link>
        </div>
      </footer>
    </div>
  );
}
