import Router from '@koa/router';
import * as authController from '../controllers/authController';
import * as postController from '../controllers/postController';
import * as categoryController from '../controllers/categoryController';
import * as commentController from '../controllers/commentController';
import * as dashboardController from '../controllers/dashboardController';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validators/auth';
import { createPostSchema, updatePostSchema } from '../validators/post';
import { createCategorySchema, updateCategorySchema } from '../validators/category';
import { createCommentSchema, updateCommentStatusSchema } from '../validators/comment';

const router = new Router();

/* ========== Auth ========== */
const authRouter = new Router({ prefix: '/api/auth' });
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.get('/me', auth(), authController.getMe);

/* ========== Posts (public) ========== */
const postsRouter = new Router({ prefix: '/api/posts' });
postsRouter.get('/', postController.getList);
postsRouter.get('/:id', postController.getById);

/* ========== Posts (admin) ========== */
const adminPostsRouter = new Router({ prefix: '/api/admin/posts' });
adminPostsRouter.post('/', auth(), validate(createPostSchema), postController.create);
adminPostsRouter.put('/:id', auth(), validate(updatePostSchema), postController.update);
adminPostsRouter.delete('/:id', auth(), postController.remove);

/* ========== Categories (public) ========== */
const categoriesRouter = new Router({ prefix: '/api/categories' });
categoriesRouter.get('/', categoryController.getList);
categoriesRouter.get('/:id', categoryController.getById);

/* ========== Categories (admin) ========== */
const adminCategoriesRouter = new Router({ prefix: '/api/admin/categories' });
adminCategoriesRouter.post('/', auth(), validate(createCategorySchema), categoryController.create);
adminCategoriesRouter.put('/:id', auth(), validate(updateCategorySchema), categoryController.update);
adminCategoriesRouter.delete('/:id', auth(), categoryController.remove);

/* ========== Comments (public) ========== */
const commentsRouter = new Router({ prefix: '/api/comments' });
commentsRouter.get('/post/:postId', commentController.getByPost);
commentsRouter.post('/', validate(createCommentSchema), commentController.create);

/* ========== Comments (admin) ========== */
const adminCommentsRouter = new Router({ prefix: '/api/admin/comments' });
adminCommentsRouter.get('/', auth(), commentController.getList);
adminCommentsRouter.put('/:id/status', auth(), validate(updateCommentStatusSchema), commentController.updateStatus);
adminCommentsRouter.delete('/:id', auth(), commentController.remove);

/* ========== Dashboard ========== */
const dashboardRouter = new Router({ prefix: '/api/admin/dashboard' });
dashboardRouter.get('/stats', auth(), dashboardController.getStats);

/* ========== Mount all ========== */
router.use(authRouter.routes()).use(authRouter.allowedMethods());
router.use(postsRouter.routes()).use(postsRouter.allowedMethods());
router.use(adminPostsRouter.routes()).use(adminPostsRouter.allowedMethods());
router.use(categoriesRouter.routes()).use(categoriesRouter.allowedMethods());
router.use(adminCategoriesRouter.routes()).use(adminCategoriesRouter.allowedMethods());
router.use(commentsRouter.routes()).use(commentsRouter.allowedMethods());
router.use(adminCommentsRouter.routes()).use(adminCommentsRouter.allowedMethods());
router.use(dashboardRouter.routes()).use(dashboardRouter.allowedMethods());

export default router;
