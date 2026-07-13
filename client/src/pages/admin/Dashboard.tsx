import { useState, useEffect } from 'react';
import { dashboardApi } from '../../api';
import type { DashboardStats } from '../../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({ posts: 0, comments: 0, pendingComments: 0, totalViews: 0 });

  useEffect(() => {
    dashboardApi.getStats().then(res => {
      if (res.data) setStats(res.data);
    });
  }, []);

  const cards = [
    { label: '文章总数', value: stats.totalPosts, accent: false },
    { label: '已发布', value: stats.publishedPosts, accent: false },
    { label: '草稿', value: stats.draftPosts, accent: false },
    { label: '总浏览', value: stats.totalViews, accent: false },
    { label: '评论总数', value: stats.totalComments, accent: false },
    { label: '待审核', value: stats.pendingComments, accent: true },
    { label: '分类数', value: stats.totalCategories, accent: false }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div key={i} className="stat-card">
          <div className="stat-card-label">{card.label}</div>
          <div className={`stat-card-value${card.accent ? ' accent' : ''}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
