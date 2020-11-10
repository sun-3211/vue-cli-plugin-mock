module.exports = (api, options) => {
    api.chainWebpack(config => {
        config.devServer.before(app => {
            console.log(app);
        });
        // console.log(config.devServer);
    });
}