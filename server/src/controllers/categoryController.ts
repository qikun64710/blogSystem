import { Context } from 'koa';
import { categoryService } from '../services/categoryService';

export async function getList(ctx: Context) {
  const data = await categoryService.findAll();
  ctx.body = { code: 0, data, message: 'success' };
}

export async function getById(ctx: Context) {
  const id = Number(ctx.params.id);
  const data = await categoryService.findById(id);
  ctx.body = { code: 0, data, message: 'success' };
}

export async function create(ctx: Context) {
  const body = (ctx.request as any).body;
  const data = await categoryService.create(body);
  ctx.status = 201;
  ctx.body = { code: 0, data, message: '创建成功' };
}

export async function update(ctx: Context) {
  const id = Number(ctx.params.id);
  const body = (ctx.request as any).body;
  await categoryService.update(id, body);
  ctx.body = { code: 0, data: null, message: '更新成功' };
}

export async function remove(ctx: Context) {
  const id = Number(ctx.params.id);
  await categoryService.delete(id);
  ctx.body = { code: 0, data: null, message: '删除成功' };
}
