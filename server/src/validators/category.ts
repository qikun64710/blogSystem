import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, '名称不能为空').max(50),
  slug: z.string().min(1, 'slug不能为空').max(50),
  description: z.string().max(500).optional(),
  sort_order: z.number().int().default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  slug: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
  sort_order: z.number().int().optional(),
});
