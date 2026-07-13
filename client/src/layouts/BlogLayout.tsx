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

  const isHome = location.pathname === '/';

  return (
    <div className="blog-layout">
      <nav className={`blog-nav ${scrolled || !isHome ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-brand">
          <svg className="nav-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="nav-brand-text">Ink<span>.</span>Blog</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/#articles">Articles</Link>
          <Link to="/login" className="nav-admin-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Admin
          </Link>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-left">
          <span>Copyright &copy; 2026 Ink.Blog</span>
          <Link to="/login" className="footer-link">Admin</Link>
        </div>
        <div className="footer-right">
          <span className="footer-text">用文字记录思考</span>
        </div>
      </footer>
    </div>
  );
}

