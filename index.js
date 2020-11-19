const webpackWatch = require('./mock/webpackWatch');
const logger = require('./mock/logger');
module.exports = (api, options) => {
    const webpack = require(api.resolve('node_modules/webpack'));
    webpackWatch.configWebpack(webpack);
    const mockOptions = options.pluginOptions && options.pluginOptions.mock || {};
    if (mockOptions.disable) {
        logger.log('mock middleware disabled!');
        return;
    }
    let entry = mockOptions.entry || './mock/';
    mockOptions.entry = api.resolve(entry);
    logger.log(mockOptions);
    if (mockOptions.type === "local") {
        api.chainWebpack(config => {
            let entry;
            try {
                entry = config.entryPoints.store.keys().next().value;
            } catch (e) {
                logger.error(e);
                entry = "app"
            }
            config.entry(entry).add("vue-cli-plugin-mock/mock/local.js");
        });
    } else if (process.env.NODE_ENV === 'development') {
        const MockMiddleware = require('./mock');
        api.configureDevServer(function (app, server) {
            app.use(MockMiddleware(mockOptions, true));
        });
        // logger.log(mockOptions);
    }
};
