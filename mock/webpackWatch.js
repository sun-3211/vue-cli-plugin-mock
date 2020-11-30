const Module = require('module');
const path = require('path');
const chalk = require('chalk');
const MemoryFS = require('memory-fs');
const logger = require('./logger');

let webpackInstance;
let ProgressPlugin;

// let outputfile = 'mock.configs.js';

function Watcher(options, callback) {
    let mfs = new MemoryFS();
    if (!webpackInstance) {
        try {
            webpackInstance = require('webpack');
        } catch (e) {
            logger.error('cannot find webpack module.');
        }
    }
    try {
        ProgressPlugin = require('webpack/lib/ProgressPlugin');
    } catch (e) {
        // ignore
    }
    // 监听文件修改重新加载代码
    let compiler = webpackInstance({
        entry: options.entry,
        output: {
            filename: '[name]',
            libraryTarget: 'commonjs2',
        },
        optimization: {
            minimize: false,
        },
        module: {
            rules: [{
                test: /\.js$/,
                use: ['babel-loader?sourceType=unambiguous'],
                exclude: /(node_modules|bower_components)/,
            }, {
                test: /\.txt$/i,
                use: 'raw-loader',
            }, {
                test: /\.json\d?$/i,
                loader: 'json5-loader',
                options: {
                    esModule: false,
                },
                type: 'javascript/auto',
            }],
        },
        target: "node",
        plugins: ProgressPlugin ? [new ProgressPlugin({})] : [],
    });
    compiler.outputFileSystem = mfs;
    compiler.watch({aggregateTimeout: options.interval}, function (error, stats) {
        if (error) {
            logger.error(chalk.red(error));
            return;
        }
        if (stats.hasErrors()) {
            const errors = stats.compilation ? stats.compilation.errors : null;
            logger.error(errors);
            return;
        }
        try {
            // Read each file and compile module
            const {outputPath} = compiler;
            const mockMap = {};
            Object.keys(options.entry).forEach(outputfile => {
                const filepath = path.join(outputPath, outputfile);
                const content = mfs.readFileSync(filepath, 'utf8');
                // logcat.log("content", content);
                const outputModule = requireFromString(content, filepath);
                if (outputModule) {
                    const mock = outputModule.default || outputModule || {};
                    Object.assign(mockMap, mock);
                    logger.log('refreshing mock service...');
                }
            });
            callback(mockMap);
        } catch (err) {
            logger.error(err);
        }
    });
}

Watcher.configWebpack = function (webpack) {
    webpackInstance = webpack;
};

module.exports = Watcher;

function requireFromString(src, filename) {
    const m = new Module();
    m._compile(src, filename);
    return m.exports;
}
