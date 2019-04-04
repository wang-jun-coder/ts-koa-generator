import Router from 'koa-router';
const router = new Router();
router.prefix('/users');

const index = async (ctx:any, next:Router.IMiddleware) => {
    await ctx.render('index', {
        title: 'Welcome to Koa/users!'
    })
};
router.get('/', index);
router.post('/', index);

const foo = async (ctx:any, next:Router.IMiddleware) => {
    ctx.body = 'this is foo response.'
};
router.get('/foo', foo);
router.post('/foo', foo);

const bar = async (ctx:any, next:Router.IMiddleware) => {
    ctx.body = 'this is bar response.'
};
router.get('/bar', bar);
router.post('/bar', bar);

export default router;
