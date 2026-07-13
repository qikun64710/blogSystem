import { Context } from 'koa';
import { postService } from '../services/postService';

export async function getList(ctx: Context) {
  const { page, pageSize, status, category_id, keyword } = ctx.query;
  const data = await postService.findAll({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    status: status as string,
    category_id: category_id ? Number(category_id) : undefined,
    keyword: keyword as string,
  });
  ctx.body = { code: 0, data, message: 'success' };
}

export async function getById(ctx: Context) {
  const id = Number(ctx.params.id);
  await postService.incrementViews(id);
  const post = await postService.findById(id);
  ctx.body = { code: 0, data: post, message: 'success' };
}

export async function create(ctx: Context) {
  const body = (ctx.request as any).body;
  const { userId } = ctx.state.user;
  const data = await postService.create(body, userId);
  ctx.status = 201;
  ctx.body = { code: 0, data, message: '创建成功' };
}

export async function update(ctx: Context) {
  const id = Number(ctx.params.id);
  const body = (ctx.request as any).body;
  await postService.update(id, body);
  ctx.body = { code: 0, data: null, message: '更新成功' };
}

export async function remove(ctx: Context) {
  const id = Number(ctx.params.id);
  await postService.delete(id);
  ctx.body = { code: 0, data: null, message: '删除成功' };
}
