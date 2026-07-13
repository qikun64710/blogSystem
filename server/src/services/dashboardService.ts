import { postService } from './postService';
import { commentService } from './commentService';
import { categoryService } from './categoryService';
import type { DashboardStats } from '../types';

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const [totalPosts, publishedPosts, draftPosts, totalViews, totalComments, pendingComments, totalCategories] = await Promise.all([
      postService.count(),
      postService.count('published'),
      postService.count('draft'),
      postService.totalViews(),
      commentService.count(),
      commentService.count('pending'),
      categoryService.count(),
    ]);

    return { totalPosts, publishedPosts, draftPosts, totalViews, totalComments, pendingComments, totalCategories };
  }
}

export const dashboardService = new DashboardService();
