import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import path from 'path';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';
import { getPool, seedDefaults } from './utils/db';
import router from './routes';

async function bootstrap() {
  // 初始化数据库
  await getPool();
  await seedDefaults();

  const app = new Koa();

  // 全局中间件
  app.use(errorHandler());
  app.use(logger);
  app.use(cors());
  app.use(koaBody());
  app.use(koaStatic(path.join(import.meta.dirname, '../public')));

  // 路由
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
