const {pathToRegexp} = require('path-to-regexp');

exports.parseKey = function parseKey(key) {
    const [method, path] = key.split(/\s+/);
    return {method, path};
};

exports.pathMatch = function pathMatch(options) {
    options = options || {};
    return function (path) {
        let keys = [];
        let re = pathToRegexp(path, keys, options);
        return function (pathname, params) {
            let m = re.exec(pathname);
            if (!m) return false;
            params = params || {};
            let key, param;
            for (let i = 0; i < keys.length; i++) {
                key = keys[i];
                param = m[i + 1];
                if (!param) continue;
                params[key.name] = decodeURIComponent(param);
                if (key.repeat) params[key.name] = params[key.name].split(key.delimiter);
            }
            return params;
        };
    };
};
