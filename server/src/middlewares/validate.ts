import { Context, Next } from 'koa';
import { z, ZodObject } from 'zod';
import { AppError } from './errorHandler';

export function validate(schema: ZodObject<any>, source: 'body' | 'query' | 'params' = 'body') {
  return async (ctx: Context, next: Next) => {
    const data = source === 'body' ? (ctx.request as any).body : ctx[source];
    const result = schema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`);
      throw new AppError(`参数校验失败: ${messages.join(', ')}`, 422);
    }
    ctx.validated = result.data;
    await next();
  };
}
