/**
 * Node Developing Assistant.
 * @author youngoat@163.com
 */

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , os = require('os')
    , path = require('path')
    , util = require('util')

    /* NPM */

    /* in-package */
    , findInDirectory = require('./lib/findInDirectory')
    , getCaller = require('./lib/getCaller')
    , getCallerPackageDir = require('./lib/getCallerPackageDir')
    , getCallerDir = () => path.dirname(getCaller(1).filename)
    ;


/**
 * Return the package.json object of the package in which the caller is located.
 * @return {object}
 */
let currentPackage = function() {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();

    // Return the meta json of the package.
    return require(dirname + '/package.json');
};

/**
 * Whether file/directory exists in the package in which the caller is located.
 * @param {string}   subpath          path relative to the homedir of current package
 * @param {boolean}  resolveAsModule  try to resolve the subpath as it is a module
 * @return {boolean}
 */
let inExists = function(subpath, resolveAsModule) {
    if (arguments.length == 1) {
        resolveAsModule = false;
    }

    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    let pathname = path.join(dirname, subpath);

    let ret;

    if (resolveAsModule) {
        ret = fs.existsSync(pathname)
            || fs.existsSync(`${pathname}.js`)
            || fs.existsSync(`${pathname}.json`)
            || fs.existsSync(path.join(pathname, 'index.js'))
            || fs.existsSync(path.join(pathname, 'index.json'))
            ;
    }
    else {
        ret = fs.existsSync(pathname);
    }
    return ret;
};

/**
 * Read file in the package in which the caller is located.
 * @param {string}   subpath          path relative to the homedir of current package
 * @param {string}  [encoding]
 * @param {boolean} [nullIfNotFound]
 * @return {string|Buffer}
 */
let inRead = function(subpath, encoding, nullIfNotFound) {
    if (arguments.length == 3) {
        // DO NOTHING.
    }
    else if (arguments.length == 2) {
        if (typeof arguments[1] == 'boolean') {
            encoding = null;
            nullIfNotFound = arguments[1];
        }
        else if (typeof arguments[1] == 'string') {
            encoding = arguments[1];
            nullIfNotFound = false;
        }
        else {
            throw new Error('The second argument should be a string (encoding) or boolean (nullIfNotFound) value.');
        }
    }

    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    let pathname = path.join(dirname, subpath);

    let ret = null;
    if (!fs.existsSync(pathname)) {
        if (!nullIfNotFound) {
            throw new Error(`File not found: ${pathname}`);
        }
    }
    else {
        ret = fs.readFileSync(pathname, encoding);
    }

    return ret;
}

/**
 * Read the contents of a directory.
 * @param {string}   subpath          path relative to the homedir of current package
 * @return {string[]}
 */
let inReaddir = function(subpath) {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    let pathname = path.join(dirname, subpath);
    
    return fs.readdirSync(pathname);
};

/**
 * To require some sub module in same package with fixed subpath wherever the caller is located.
 *
 * @example
 * // PACKAGE_HOMEDIR/lib/index.js
 *
 * // PACKAGE_HOMEDIR/foo.js
 * noda.inRequire('lib');
 *
 * // PACKAGE_HOMEDIR/foo/bar.js
 * noda.inRequire('lib');
 *
 * @param {string} subpath sub module's path relative to the home directory of the package in which the caller is located.
 */
let inRequire = function(subpath, nullIfNotFound) {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    let pathname = path.join(dirname, subpath);

    let mod = null;
    try {
        mod = require(pathname);
    } catch (ex) {
        if (nullIfNotFound && ex.code === 'MODULE_NOT_FOUND') {
            mod = null;
        }
        else {
            throw ex;
        }
    }
    return mod;
};

/**
 * Resolve the subpath into an absolute path.
 * The subpath is relative to the home directory of the package in which the caller is located.
 * @param {string} subpath subpath relative to the home directory of the package in which the caller is located.
 */
let inResolve = function(...subpath) {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    return path.join.apply(path, [ dirname ].concat(subpath));
};

/**
 * Require module whose name is same with the name of current platform.
 * @param {string} dirname
 */
let osRequire = (dirname) => {
    if (!path.isAbsolute(dirname)) {
        dirname = path.resolve(getCallerDir(), dirname);
    }

    try {
        return require(path.join(dirname, os.platform()));
    }
    catch (ex) {
        if (ex.code === 'MODULE_NOT_FOUJND') {
            throw new Error(`current platform not supported: ${os.platform()}`);
        }
        else {
            throw ex;
        }
    }
};

/**
 * Read the directory and require all javascript modules except those excluded.
 * ATTENTION: Directory 'node_modules' is always excluded.
 * @param  {string}  dirname
 * @param  {Array}  [excludes = ['index']]  names to be excluded(ignored)
 * @param  {string} [exlucdes]              the only name to be excluded(ingored)
 * @return {Object}
 */
let requireDir = (dirname, excludes) => {
    if (!path.isAbsolute(dirname)) {
        dirname = path.resolve(getCallerDir(), dirname);
    }

    // Uniform the argument "excludes".
    if (util.isUndefined(excludes)) {
        excludes = [ 'index' ];
    }
    else if (util.isString(excludes)) {
        excludes = [ excludes ];
    }
    excludes = excludes.map(exclude => exclude.replace(/\.js$/, ''));

    // Iterate the directory and require sub modules.
    let mod = {};
    fs.readdirSync(dirname).forEach((name) => {
        let pathname = path.join(dirname, name);
        let modname = null;

        if (!excludes.includes['*'] && path.extname(name) === '.js') {
            modname = name.replace(/\.js$/, '');
        }
        else if (fs.statSync(pathname).isDirectory()
            && !excludes.includes('*/')
            && fs.existsSync(path.join(pathname, 'index.js'))) {
            modname = name;
        }

        if (modname && !excludes.includes(modname)) {
            mod[modname] = require(pathname);
        }
    });
    return mod;
};

/**
 * Based on requireDir(), but the dirname is regarded as relative path to home directory of the package in which the caller is located.
 */
let inRequireDir = (dirname, excludes) => {
    dirname = path.join(getCallerPackageDir(), dirname);
    return requireDir(dirname, excludes);
};

/**
 * Read file next to the file in which the caller is located.
 * @param {string}   subpath          path relative to the directory of the caller file
 * @param {string}  [encoding]
 * @param {boolean} [nullIfNotFound]
 * @return {string|Buffer}
 */
let nextRead = function(subpath, encoding, nullIfNotFound) {
    if (arguments.length == 3) {
        // DO NOTHING.
    }
    else if (arguments.length == 2) {
        if (typeof arguments[1] == 'boolean') {
            encoding = null;
            nullIfNotFound = arguments[1];
        }
        else if (typeof arguments[1] == 'string') {
            encoding = arguments[1];
            nullIfNotFound = false;
        }
        else {
            throw new Error('The second argument should be a string (encoding) or boolean (nullIfNotFound) value.');
        }
    }

    // Find the directory of the file in which the caller is located.
    let dirname = getCallerDir();
    let pathname = path.join(dirname, subpath);

    let ret = null;
    if (!fs.existsSync(pathname)) {
        if (!nullIfNotFound) {
            throw new Error(`File not found: ${pathname}`);
        }
    }
    else {
        ret = fs.readFileSync(pathname, encoding);
    }

    return ret;
}

/**
 * Find sub-directory or file in ascent directory and return the full path.
 * @param {string} pathname relative pathname of sub-directory or file
 * @return {string}
 */
let upResolve = (pathname) => {
    let cwd = getCallerDir();
    let realPathname = null;
    for (let d = null; d != cwd && !realPathname; cwd = path.dirname(cwd)) {
        let p = path.join(cwd, pathname);
        if (fs.existsSync(p)) realPathname = p;
        else d = cwd;
    }
    return realPathname;
};

/**
 * Find sub-directory or file in descent directory and return the full path.
 * @param {string}  pathname     - relative pathname of sub-directory or file
 * @param {number} [depth=9]     - max depth to search
 * @param {string} [order=bfs]   - DFS (Depth-First Search) or BFS (Breadth-First Search)
 * @return {string}
 */
let downResolve = function(pathname) {
    let depth = null, order = null;
    for (let i = 1, arg; i < arguments.length; i++) {
        switch (typeof arguments[i]) {
            case 'number':
                if (depth === null) depth = arguments[i];
                else throw new Error(`duplicated arguments: {number} depth`);
                break;
            case 'string':
                if (order === null) order = arguments[i];
                else throw new Error(`duplicated arguments: {string} order`);
                break;
            default:
                if (!util.isUndefined(arguments[i]) && arguments[i] !== null) {
                    throw new Error(`unrecognized argument: ${arguments[i]}`);
                }
        }
    }

    if (depth === null) depth = 9;
    if (order === null) order = 'bfs';

    order = order.toLowerCase();
    let cwd = getCallerDir();
    if (order == 'dfs') {
        return findInDirectory.depth_first(cwd, pathname, depth);
    }
    if (order == 'bfs') {
        return findInDirectory.breadth_first(cwd, pathname, depth);
    }
    throw new Error(`invalid order: ${order}`);
};

/**
 * Return the root path of current package.
 */
let packageRoot = function() {
    return inResolve('.');
};

/**
 * Return dirname, filename and lineno of the caller.
 * @param  {int} [depth=0] 
 */
let whereami = function(depth) {
    if (arguments.length === 0) depth = 0;
    return getCallerPosition(depth);
};

module.exports = {
    bindings: require('./bindings'),
    packageOf: require('./packageOf'),
    
    currentPackage,
    inExists,
    inRead,
    inReaddir,
    inRequire,
    inRequireDir,
    inResolve,

    nextRead,
    upResolve,
    downResolve,
    
    // Hold, not released.
//  whereami,

    osRequire,
    requireDir,

    count: require('./count'),

    'existsInPackage': inExists,
    'readInPackage': inRead,
    'requireInPackage': inRequire,
    'requireDirInPackage': inRequireDir,
    'resolveInPackage': inResolve,
};