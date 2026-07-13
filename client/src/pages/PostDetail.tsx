import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { postsApi, commentsApi } from '../api';
import type { Post, Comment } from '../types';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ author_name: '', author_email: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const postId = Number(id);

    Promise.all([
      postsApi.getById(postId),
      commentsApi.getByPost(postId)
    ]).then(([postRes, commentsRes]) => {
      setPost(postRes.data);
      setComments(commentsRes.data || []);
      setLoading(false);
    });
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentForm.author_name || !commentForm.content) return;

    try {
      const res = await commentsApi.add({
        post_id: Number(id),
        author_name: commentForm.author_name,
        author_email: commentForm.author_email || undefined,
        content: commentForm.content
      });
      if (res.code === 0) {
        setCommentForm({ author_name: '', author_email: '', content: '' });
        const commentsRes = await commentsApi.getByPost(Number(id));
        setComments(commentsRes.data || []);
      }
    } catch (err: any) {
      alert(err.message || '评论失败');
    }
  };

  if (loading) return <div className="empty-state"><p>加载中...</p></div>;
  if (!post) return <div className="empty-state"><p>文章不存在</p></div>;

  return (
    <div className="post-detail-page">
      <header className="post-detail-header">
        {post.category_name && (
          <span className="post-detail-category">{post.category_name}</span>
        )}
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {post.view_count} views
          </span>
        </div>
      </header>

      <article className="post-detail-content">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <div className="comments-section">
        <h3 className="comments-title">评论 ({comments.length})</h3>

        <form className="comment-form" onSubmit={handleSubmitComment}>
          <input
            type="text"
            placeholder="你的昵称"
            value={commentForm.author_name}
            onChange={(e) => setCommentForm({ ...commentForm, author_name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="邮箱（选填）"
            value={commentForm.author_email}
            onChange={(e) => setCommentForm({ ...commentForm, author_email: e.target.value })}
          />
          <textarea
            placeholder="写下你的想法..."
            value={commentForm.content}
            onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
            required
          />
          <button type="submit">发表评论</button>
        </form>

        {comments.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-8) 0' }}>
            还没有评论，来说两句吧
          </p>
        )}

        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-author">{comment.author_name}</div>
            <div className="comment-date">{new Date(comment.created_at).toLocaleString('zh-CN')}</div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
