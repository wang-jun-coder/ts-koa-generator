"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
router.prefix('/users');
const index = async (ctx, next) => {
    await ctx.render('index', {
        title: 'Welcome to Koa/users!'
    });
};
router.get('/', index);
router.post('/', index);
const foo = async (ctx, next) => {
    ctx.body = 'this is foo response.';
};
router.get('/foo', foo);
router.post('/foo', foo);
const bar = async (ctx, next) => {
    ctx.body = 'this is bar response.';
};
router.get('/bar', bar);
router.post('/bar', bar);
exports.default = router;
//# sourceMappingURL=users.js.map