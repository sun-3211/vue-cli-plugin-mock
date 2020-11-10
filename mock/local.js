import request from 'umi-request';

const files = require.context('../../../mock', true, /\.js$/);
const route = {GET: {}, POST: {}};
files.keys().forEach(key => {
    Object.assign(route, files(key).default);
});

Object.keys(route).forEach(key => {
    const d = key.split(" ");
    route[d[0].toUpperCase()][d[1]] = route[key];
});

request.use(async (ctx, next) => {
        if (route[ctx.req.options.method]) {
            const data = route[ctx.req.options.method][ctx.req.url];
            console.log(data);
        }
        return next();
    }, {core: true, global: true}
);
