import Router from 'koa-router';
const router = new Router();

const index = async (ctx:Router.RouterContext, next:any) => {
    await ctx.render('index', {
        title: 'Welcome to Koa!'
    })
};
router.get('/', index);
router.post('/', index);


const json = async (ctx:Router.RouterContext, next:any) => {
    ctx.body = {
        query: ctx.request.query,
        body: ctx.request.body,
        headers: ctx.request.headers
    }
};
router.get('/json', json);
router.post('/json', json);


const string = async (ctx:Router.RouterContext, next:any) => {
    ctx.body = 'welcome to Koa!';
};
router.get('/string', string);
router.post('/string', string);


export default router;
