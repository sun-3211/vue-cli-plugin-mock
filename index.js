const webpackWatch = require('./mock/webpackWatch');
const logger = require('./mock/logger');
module.exports = (api, options) => {
    console.log(api, options);
    const webpack = require(api.resolve('node_modules/webpack'));
    webpackWatch.configWebpack(webpack);
    const mockOptions = options.pluginOptions && options.pluginOptions.mock || {};
    if (mockOptions.disable) {
        logger.log('mock middleware disabled!');
        return;
    }
    let entry = mockOptions.entry || './mock/';
    mockOptions.entry = api.resolve(entry);
    console.log(mockOptions);
    if (mockOptions.type === "local") {
        const MockMiddleware = require('./mock/local');
        const mocker = MockMiddleware(mockOptions, true);
        mocker.refresh = function (data) {
            // api.injectImports(api.entryFile, `
            // import MockUtil from 'vue-cli-plugin-mock/mock/local_util.js'
            // new MockUtil(${data})
            // `)
            console.log("====>", data);
        }
    } else if (process.env.NODE_ENV === 'development') {
        const MockMiddleware = require('./mock');
        api.configureDevServer(function (app, server) {
            app.use(MockMiddleware(mockOptions, true));
        });
        // logger.log(mockOptions);
    }
};
