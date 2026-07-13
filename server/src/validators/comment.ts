import { z } from 'zod';

export const createCommentSchema = z.object({
  post_id: z.number().int().positive('文章ID无效'),
  parent_id: z.number().int().positive().optional().nullable(),
  author_name: z.string().min(1, '昵称不能为空').max(50),
  author_email: z.string().email('邮箱格式不正确').max(100).optional().nullable(),
  content: z.string().min(1, '评论内容不能为空').max(2000),
});

export const updateCommentStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], { errorMap: () => ({ message: '状态无效' }) }),
});
