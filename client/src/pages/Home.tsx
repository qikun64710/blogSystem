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

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-eyebrow">Software Engineer & Writer</span>
          <h1 className="hero-title">Ink.Blog</h1>
          <p className="hero-subtitle">用代码构建世界，用文字记录思考。</p>
          <p className="hero-subtitle-en">Building with code, thinking with words.</p>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-number">{total}</div>
              <div className="hero-stat-label">Articles</div>
            </div>
            <div>
              <div className="hero-stat-number">{categories.length}</div>
              <div className="hero-stat-label">Categories</div>
            </div>
          </div>
          <div className="hero-actions">
            <a href="#articles" className="hero-btn hero-btn-primary">Read Articles</a>
            <Link to="/login" className="hero-btn hero-btn-secondary">Admin</Link>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="section-block" id="articles">
          <Link to={`/post/${featured.id}`} className="featured-card">
            <div className="featured-card-content">
              <div className="featured-tags">
                <span className="tag tag-blue">Latest</span>
                {featured.category_name && <span className="tag tag-outline">{featured.category_name}</span>}
              </div>
              <h2 className="featured-card-title">{featured.title}</h2>
              <p className="featured-card-desc">
                {featured.summary || featured.content.replace(/[#*`\n>]/g, '').slice(0, 120) + '...'}
              </p>
              <div className="featured-card-meta">
                <span>{new Date(featured.created_at).toLocaleDateString('zh-CN')}</span>
                <span>·</span>
                <span>{featured.view_count} 次阅读</span>
                <span className="featured-read-more">Read more →</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest Articles Grid */}
      {restPosts.length > 0 && (
        <section className="section-block" style={{ paddingTop: 0 }}>
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">Recent Posts</div>
              <h2 className="section-title">Latest Articles</h2>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button
                className={`tag ${!categoryId ? 'tag-blue' : 'tag-outline'}`}
                style={{ cursor: 'pointer', border: !categoryId ? 'none' : '1px solid var(--border)', color: !categoryId ? '#fff' : 'var(--tag-text)', background: !categoryId ? 'var(--accent)' : 'var(--tag-bg)' }}
                onClick={() => handleCategoryClick('')}
              >
                全部
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`tag ${String(cat.id) === categoryId ? 'tag-blue' : 'tag-outline'}`}
                  style={{ cursor: 'pointer', border: String(cat.id) === categoryId ? 'none' : '1px solid var(--border)', color: String(cat.id) === categoryId ? '#fff' : 'var(--tag-text)', background: String(cat.id) === categoryId ? 'var(--accent)' : 'var(--tag-bg)' }}
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
                <div className="article-card-image" style={{
                  background: post.cover_image
                    ? `url(${post.cover_image}) center/cover`
                    : `linear-gradient(135deg, hsl(${post.id * 47 % 360}, 60%, 85%), hsl(${(post.id * 47 + 60) % 360}, 50%, 75%))`
                }} />
                <div className="article-card-body">
                  <div className="article-card-tags">
                    {post.category_name && (
                      <span className="article-card-tag">{post.category_name}</span>
                    )}
                  </div>
                  <h3 className="article-card-title">{post.title}</h3>
                  <p className="article-card-excerpt">
                    {post.summary || post.content.replace(/[#*`\n>]/g, '').slice(0, 80) + '...'}
                  </p>
                  <div className="article-card-footer">
                    <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                    <div className="article-card-stats">
                      <span>{post.view_count} 阅读</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={p === page ? 'active' : ''} onClick={() => handlePageChange(p)}>
                  {p}
                </button>
              ))}
              <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>→</button>
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
