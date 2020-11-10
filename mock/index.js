const path = require('path');
const fs = require("fs");
const chalk = require('chalk');
const apiMocker = require('express-mock-restful');
let fsWatch = require('./fsWatch');
let logcat = require('./logger');
let webpackWatch = require('./webpackWatch');
let isDebug = false;

module.exports = function (options, useWebpack) {
    options = options || {};
    let mockPath = options.entry;
    let entry = [];
    isDebug = options.debug;
    if (path.isAbsolute(mockPath) === false) {
        mockPath = path.resolve(process.cwd(), mockPath);
    }
    if (!fs.existsSync(mockPath)) {
        logcat.log("未创建mock目录");
    } else {
        const pa = fs.readdirSync(mockPath);
        pa.forEach(function (ele, index) {
            // entry.push()
            entry[ele] = path.join(mockPath, ele);
        });
    }
    logcat.log("entry", entry, mockPath);
    let watchConfig = {entry: mockPath, interval: options.interval || 200};
    if (useWebpack) {
        isDebug && logcat.debug('use webpack watch mock file.');
        webpackWatch(watchConfig, refreshMock);
    } else {
        isDebug && logcat.debug('use fs watchFile mock file.');
        fsWatch(watchConfig, refreshMock);
    }

    return apiMocker({}, mocklogFn);

    function refreshMock(mockObj) {
        logcat.log("refreshMock", mockObj);
        apiMocker.refresh(mockObj);
        logcat.log('Done: Hot Mocker file replacement success!');
    }

    function mocklogFn(type, msg) {
        if (type === 'matched') {
            logcat.log(type + ' ' + msg);
        } else {
            isDebug && logcat.debug(type + ' ' + msg);
        }
    }
};
