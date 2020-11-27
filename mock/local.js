import request from 'umi-request';

const files = require.context('../../../../mock', true, /\.js$/);
const route = {GET: {}, POST: {}};
files.keys().forEach(file => {
    const mock = files(file).default;
    Object.keys(mock).forEach(key => {
        const [method, path] = key.split(/\s+/);
        route[method.toUpperCase()][path.toLowerCase()] = mock[key];
    });
});

// console.log(route)

request.use(async (ctx, next) => {
        if (route[ctx.req.options.method.toUpperCase()] &&
            route[ctx.req.options.method.toUpperCase()][ctx.req.url.toLowerCase()]) {
            const data = route[ctx.req.options.method.toUpperCase()][ctx.req.url.toLowerCase()];
            if (data instanceof Function) {
                const promise = new Promise(resolve => {
                    const params = {
                        ...ctx.req.options,
                        body: ctx.req.options.data || {},
                        query: ctx.req.options.params || {}
                    };
                    data(JSON.parse(JSON.stringify(params)), {
                        json(d) {
                            const result = JSON.parse(JSON.stringify(d));
                            resolve(result);
                        },
                        end: resolve
                    });
                });
                ctx.res = await promise;
            } else {
                if (data instanceof Object) {
                    ctx.res = JSON.parse(JSON.stringify(data));
                } else {
                    ctx.res = data;
                }
            }
            return;
        }
        await next();
    }, {global: true}
);
