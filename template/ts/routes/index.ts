import Router from 'koa-router';
const router = new Router();

const index = async (ctx:any, next:Router.IMiddleware) => {
    await ctx.render('index', {
        title: 'Welcome to Koa!'
    })
};
router.get('/', index);
router.post('/', index);


const json = async (ctx:any, next:Router.IMiddleware) => {
    ctx.body = {
        query: ctx.request.query,
        body: ctx.request.body,
        headers: ctx.request.headers
    }
};
router.get('/json', json);
router.post('/json', json);


const string = async (ctx:any, next:Router.IMiddleware) => {
    ctx.body = 'welcome to Koa!'
};
router.get('/string', json);
router.post('/string', json);


export default router;
