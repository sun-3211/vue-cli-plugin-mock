import request from 'umi-request';

const files = require.context('../../../mock', true, /\.js$/);
const route = {GET: {}, POST: {}};
files.keys().forEach(key => {
    Object.assign(route, files(key).default);
});

Object.keys(route).forEach(key => {
    if (key === "GET" || key === "POST") return;
    const d = key.split(" ");
    route[d[0].toUpperCase()][d[1].toLowerCase()] = route[key];
});

request.use(async (ctx, next) => {
        if (route[ctx.req.options.method.toUpperCase()] &&
            route[ctx.req.options.method.toUpperCase()][ctx.req.url.toLowerCase()]) {
            const data = route[ctx.req.options.method.toUpperCase()][ctx.req.url.toLowerCase()];
            if (data instanceof Function) {
                const promise = new Promise(resolve => {
                    const request = {body: ctx.req.options.data || {}, query: ctx.req.options.params || {}};
                    data(JSON.parse(JSON.stringify(request)), {
                        json: resolve,
                        end: resolve
                    });
                });
                ctx.res = await promise;
            } else {
                ctx.res = data;
            }
            return;
        }
        await next();
    }, {core: true, global: true}
);
