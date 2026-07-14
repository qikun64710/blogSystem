import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postsApi, categoriesApi } from '../api';
import type { Post, Category } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const categoryId = searchParams.get('category') || '';

  useEffect(() => {
    categoriesApi.getList().then(res => {
      if (res.data) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    const params: Record<string, number | string> = { page, pageSize: 9 };
    if (categoryId) params.category_id = Number(categoryId);

    postsApi.getList(params).then(res => {
      if (res.data) {
        setPosts(res.data.list || []);
        setTotal(res.data.total);
      }
    });
  }, [page, categoryId]);

  const totalPages = Math.ceil(total / 9);
  const featured = posts[0];
  const restPosts = posts.slice(1);

  const handleCategoryClick = (id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id === categoryId) {
      params.delete('category');
    } else {
      params.set('category', id);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToArticles = () => {
    const el = document.getElementById('articles');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Calculate years since first post
  const firstPostDate = posts.length > 0 ? new Date(posts[posts.length - 1].created_at) : new Date();
  const yearsDiff = Math.max(1, Math.ceil((Date.now() - firstPostDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)));

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Software Engineer & Writer
          </div>
          <h1 className="hero-title" data-text="HI, INK.BLOG!">HI, INK.BLOG!</h1>
          <p className="hero-subtitle">用代码构建世界，用文字记录思考。</p>
          <p className="hero-subtitle-en">Building with code, thinking with words.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">{total}</div>
              <div className="hero-stat-label">Articles</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">{yearsDiff}</div>
              <div className="hero-stat-label">Years</div>
            </div>
          </div>
          <div className="hero-actions">
            <button className="hero-btn hero-btn-primary" onClick={scrollToArticles}>Read Articles</button>
            <Link to="/login" className="hero-btn hero-btn-secondary">GitHub</Link>
          </div>
        </div>
        <div className="hero-scroll-indicator" onClick={scrollToArticles}>
          <span>SCROLL</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="section-block">
          <h2 className="section-heading">
            <svg className="section-heading-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Featured Categories
          </h2>
          <div className="category-grid">
            {categories.slice(0, 3).map(cat => (
              <button
                key={cat.id}
                className={`category-card ${String(cat.id) === categoryId ? 'active' : ''}`}
                onClick={() => handleCategoryClick(String(cat.id))}
              >
                <div className="category-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="category-card-info">
                  <h3 className="category-card-name">{cat.name}</h3>
                  <p className="category-card-desc">{cat.description || `${cat.post_count} articles`}</p>
                </div>
                <svg className="category-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured Post */}
      {featured && (
        <section className="section-block featured-section">
          <Link to={`/post/${featured.id}`} className="featured-card">
            <div
              className="featured-card-bg"
              style={{
                background: featured.cover_image
                  ? `url(${featured.cover_image}) center/cover`
                  : `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`
              }}
            />
            <div className="featured-card-overlay" />
            <div className="featured-card-content">
              <div className="featured-tags">
                <span className="tag tag-latest">Latest</span>
                {featured.category_name && <span className="tag tag-category">{featured.category_name}</span>}
              </div>
              <h2 className="featured-card-title">{featured.title}</h2>
              <p className="featured-card-desc">
                {featured.summary || featured.content.replace(/[#*`\n>]/g, '').slice(0, 150) + '...'}
              </p>
              <div className="featured-card-meta">
                <span className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {new Date(featured.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {featured.view_count}
                </span>
                <span className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {featured.comment_count || 0}
                </span>
                <span className="featured-read-more">
                  Read more
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest Articles */}
      {restPosts.length > 0 && (
        <section className="section-block" id="articles">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Latest Articles</h2>
            </div>
            {totalPages > 1 && (
              <Link to={`/?page=${Math.min(page + 1, totalPages)}`} className="section-view-all">
                View all
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="category-filter">
              <button
                className={`filter-btn ${!categoryId ? 'active' : ''}`}
                onClick={() => handleCategoryClick('')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-btn ${String(cat.id) === categoryId ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(String(cat.id))}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="article-grid">
            {restPosts.map(post => (
              <Link key={post.id} to={`/post/${post.id}`} className="article-card">
                <div
                  className="article-card-image"
                  style={{
                    background: post.cover_image
                      ? `url(${post.cover_image}) center/cover`
                      : `linear-gradient(135deg, hsl(${post.id * 47 % 360}, 40%, 75%), hsl(${(post.id * 47 + 60) % 360}, 35%, 65%))`
                  }}
                />
                <div className="article-card-body">
                  <div className="article-card-tags">
                    {post.category_name && (
                      <span className="article-card-tag">{post.category_name}</span>
                    )}
                  </div>
                  <h3 className="article-card-title">{post.title}</h3>
                  <p className="article-card-excerpt">
                    {post.summary || post.content.replace(/[#*`\n>]/g, '').slice(0, 100) + '...'}
                  </p>
                  <div className="article-card-footer">
                    <span className="card-date">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="article-card-stats">
                      <span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {post.view_count}
                      </span>
                      <span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {post.comment_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={p === page ? 'active' : ''} onClick={() => handlePageChange(p)}>
                  {p}
                </button>
              ))}
              <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </section>
      )}

      {posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">✍</div>
          <p className="empty-state-text">还没有文章，去后台写一篇吧</p>
        </div>
      )}
    </div>
  );
}

