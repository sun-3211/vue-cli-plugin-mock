const path = require('path');
const fs = require("fs");
const apiMocker = require('./api_mocker');
const fsWatch = require('./fsWatch');
const logcat = require('./logger');
const webpackWatch = require('./webpackWatch');
let isDebug = false;

module.exports = function (options, useWebpack) {
    options = options || {};
    let mockPath = options.entry;
    let entry = {};
    isDebug = options.debug;
    if (path.isAbsolute(mockPath) === false) {
        mockPath = path.resolve(process.cwd(), mockPath);
    }
    if (!fs.existsSync(mockPath)) {
        logcat.error("未创建mock目录");
        return apiMocker();
        // return;
    } else {
        const pa = fs.readdirSync(mockPath);
        pa.forEach(function (ele, index) {
            entry[ele] = path.join(mockPath, ele);
        });
    }
    // logcat.log("entry", entry);
    let watchConfig = {entry: entry, interval: options.interval || 200};
    if (useWebpack) {
        isDebug && logcat.debug('use webpack watch mock file.');
        webpackWatch(watchConfig, refreshMock);
    } else {
        isDebug && logcat.debug('use fs watchFile mock file.');
        fsWatch(watchConfig, refreshMock);
    }

    return apiMocker();

    function refreshMock(mockObj) {
        logcat.log("refreshMock", Object.keys(mockObj));
        apiMocker.refresh(mockObj);
        logcat.log('Done: Hot Mocker file replacement success!');
    }

};
