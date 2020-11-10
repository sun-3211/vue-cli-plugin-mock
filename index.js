module.exports = (api, options) => {
    console.log("api");
    api.chainWebpack(config => {
        console.log("config");
        config.devServer.before(app => {
            app.get('/test', function (req, res) {
                // res.json({aaa: "bbb"});
                res.end("aaaaaaaaaaaaaaaa");
            });
        });
        // console.log(config.devServer);
    });
}