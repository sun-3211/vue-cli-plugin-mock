module.exports = (api, options) => {
    api.chainWebpack(config => {
        const before = config.devServer.get("before");
        config.devServer.before(app => {
            before(app);
            app.get('/test', function (req, res) {
                // res.json({aaa: "bbb"});
                res.end("testtesttesttesttest");
            });
        });
    });
}