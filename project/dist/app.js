"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const app = new koa_1.default();
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('http');
const koa_views_1 = __importDefault(require("koa-views"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_static_1 = __importDefault(require("koa-static"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
// body parser
app.use(koa_bodyparser_1.default({
    enableTypes: ['json', 'form', 'text']
}));
app.use(koa_static_1.default(__dirname + '/public'));
app.use(koa_views_1.default(__dirname + '/views', {
    extension: 'pug'
}));
// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const now = Date.now();
    const ms = now - start;
    debug(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
// routes
app.use(index_1.default.routes());
app.use(users_1.default.routes());
// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});
exports.default = app;
//# sourceMappingURL=app.js.map