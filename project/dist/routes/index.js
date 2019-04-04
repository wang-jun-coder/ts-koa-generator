"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
const index = async (ctx, next) => {
    await ctx.render('index', {
        title: 'Welcome to Koa!'
    });
};
router.get('/', index);
router.post('/', index);
const json = async (ctx, next) => {
    ctx.body = {
        query: ctx.request.query,
        body: ctx.request.body,
        headers: ctx.request.headers
    };
};
router.get('/json', json);
router.post('/json', json);
const string = async (ctx, next) => {
    ctx.body = 'welcome to Koa!';
};
router.get('/string', json);
router.post('/string', json);
exports.default = router;
//# sourceMappingURL=index.js.map