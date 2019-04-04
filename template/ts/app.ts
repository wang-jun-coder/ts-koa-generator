import Koa from 'koa';
const app = new Koa();

import Debug from 'debug';
const debug = Debug('http');

import views from 'koa-views';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';


import index from './routes/index';
import users from './routes/users';

// body parser
app.use(bodyParser({
    enableTypes:['json', 'form', 'text']
}));

app.use(serve(__dirname + '/public'));
app.use(views(__dirname + '/views', {
    extension: '${viewEngine}'
}));

// logger
app.use(async (ctx:any, next:any) => {
    const start = Date.now();
    await next();
    const now = Date.now();
    const ms = now - start;
    debug(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes());
app.use(users.routes());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

export default app;
