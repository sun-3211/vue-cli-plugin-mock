const MockMiddleware = require('./mock');
const webpackWatch = require('./mock/webpackWatch');
const logger = require('./mock/logger');
module.exports = (api, options) => {
    if (process.env.NODE_ENV === 'development') {
        const webpack = require(api.resolve('node_modules/webpack'));
        webpackWatch.configWebpack(webpack);
        const mockOptions = options.pluginOptions && options.pluginOptions.mock || {};
        if (mockOptions.disable) {
            logger.log('mock middleware disabled!');
            return;
        }
        let entry = './mock/';
        mockOptions.entry = api.resolve(entry);
        logger.log(mockOptions);
        api.configureDevServer(function (app, server) {
            app.use(MockMiddleware(mockOptions, true));
        });
    }
};
