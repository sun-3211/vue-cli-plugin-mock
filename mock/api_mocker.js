const logcat = require('./logger');
const utils = require('./utils');
const parse = require('url').parse;
const bodyParser = require('body-parser');

let mockRouteMap = {};

const apiMocker = function () {

    return function (req, res, next) {
        let route = matchRoute(req);
        if (route) {
            //match url
            logcat.log('matched', `${route.method.toUpperCase()} ${route.path}`);
            let bodyParserMethd = bodyParser.json();
            const contentType = req.get('Content-Type');
            if (contentType === 'text/plain') {
                bodyParserMethd = bodyParser.raw({type: 'text/plain'});
            } else if (contentType === 'application/x-www-form-urlencoded') {
                bodyParserMethd = bodyParser.urlencoded({extended: false});
            }
            bodyParserMethd(req, res, function () {
                const result = utils.pathMatch({sensitive: false, strict: false, end: false});
                const match = result(route.path);
                req.params = match(parse(req.url).pathname);
                route.handler(req, res, next);
            });
        } else {
            next();
        }
    };
}
// 用于刷新mock设置
apiMocker.refresh = function (mockObj) {
    mockRouteMap = {};
    createRoute(mockObj);
};

function createRoute(mockModule) {
    Object.keys(mockModule).forEach((key) => {
        let result = utils.parseKey(key);
        let method = result.method;
        let handler = mockModule[key];
        let regexp = new RegExp('^' + result.path.replace(/(:\w*)[^/]/gi, '(.*)') + '$');
        let route = {path: result.path, method, regexp};
        if (typeof handler === 'function') {
            route.handler = handler;
        } else {
            route.handler = (req, res) => res.json(mockModule[key]);
        }
        if (!mockRouteMap[method]) {
            mockRouteMap[method] = [];
        }
        // logcat.log('createRoute', ': path:' + route.path + '  method:' + route.method);
        mockRouteMap[method].push(route);
    });
}

function matchRoute(req) {
    let url = req.url;
    let method = req.method.toLowerCase();
    let uri = url.replace(/\?.*$/, '');
    logcat.log('matchRoute', ':(path:' + url + '  method:' + method + ')');
    let routerList = mockRouteMap[method];
    return routerList && routerList.find((item) => item.path === uri || item.regexp.test(uri));
}

module.exports = apiMocker;