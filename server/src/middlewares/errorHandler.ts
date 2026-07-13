import { Context, Next } from 'koa';

export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function errorHandler() {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (err: any) {
      const status = err.status || 500;
      const message = err.message || 'Internal Server Error';
      ctx.status = status;
      ctx.body = { code: status, data: null, message };
      if (status >= 500) {
        console.error('[Server Error]', err);
      }
    }
  };
}
