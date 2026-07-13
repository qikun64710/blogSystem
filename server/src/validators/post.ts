import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200),
  slug: z.string().max(200).optional(),
  content: z.string().min(1, '内容不能为空'),
  summary: z.string().max(500).optional(),
  cover_image: z.string().url().optional().nullable(),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(['draft', 'published']).default('published'),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().max(200).optional(),
  content: z.string().min(1).optional(),
  summary: z.string().max(500).optional(),
  cover_image: z.string().url().optional().nullable(),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(['draft', 'published']).optional(),
});
