import { Context } from 'koa';
import { commentService } from '../services/commentService';

export async function getByPost(ctx: Context) {
  const postId = Number(ctx.params.postId);
  const data = await commentService.findByPostId(postId);
  ctx.body = { code: 0, data, message: 'success' };
}

export async function getList(ctx: Context) {
  const { page, pageSize, status } = ctx.query;
  const data = await commentService.findAll({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
    status: status as string,
  });
  ctx.body = { code: 0, data, message: 'success' };
}

export async function create(ctx: Context) {
  const body = (ctx.request as any).body;
  const data = await commentService.create(body);
  ctx.status = 201;
  ctx.body = { code: 0, data, message: '评论已提交，等待审核' };
}

export async function updateStatus(ctx: Context) {
  const id = Number(ctx.params.id);
  const { status } = (ctx.request as any).body;
  await commentService.updateStatus(id, status);
  ctx.body = { code: 0, data: null, message: '更新成功' };
}

export async function remove(ctx: Context) {
  const id = Number(ctx.params.id);
  await commentService.delete(id);
  ctx.body = { code: 0, data: null, message: '删除成功' };
}
