import { Context } from 'koa';
import { authService } from '../services/authService';

export async function login(ctx: Context) {
  const { username, password } = (ctx.request as any).body;
  const data = await authService.login(username, password);
  ctx.body = { code: 0, data, message: '登录成功' };
}

export async function getMe(ctx: Context) {
  const { userId } = ctx.state.user;
  const user = await authService.getCurrentUser(userId);
  ctx.body = { code: 0, data: user, message: 'success' };
}
