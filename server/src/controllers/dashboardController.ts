import { Context } from 'koa';
import { dashboardService } from '../services/dashboardService';

export async function getStats(ctx: Context) {
  const data = await dashboardService.getStats();
  ctx.body = { code: 0, data, message: 'success' };
}
