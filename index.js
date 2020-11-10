module.exports = (api, options) => {
    console.log("api")
    api.chainWebpack(config => {
        // const before = config.devServer.get("before");
        config.devServer.delete("before");
        console.log("config")
        config.devServer.before(app => {
            console.log("before")
            // before(app);
            app.get('/test', function (req, res) {
                // res.json({aaa: "bbb"});
                res.end("testtesttesttesttest");
            });
        });
    });
}