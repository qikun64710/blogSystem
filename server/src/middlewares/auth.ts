import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';
import type { JwtPayload } from '../types';

export function auth() {
  return async (ctx: Context, next: Next) => {
    const token = ctx.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new AppError('未提供认证令牌', 401);
    try {
      const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
      ctx.state.user = payload;
      await next();
    } catch {
      throw new AppError('令牌无效或已过期', 401);
    }
  };
}
