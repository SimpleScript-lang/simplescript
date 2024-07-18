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
    , getCallerFileName = require('./lib/getCallerFileName')
    , getCallerPackageDir = require('./lib/getCallerPackageDir')
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
let inResolve = (subpath) => {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();

    return path.join(dirname, subpath);
};

/**
 * Require module whose name is same with the name of current platform.
 * @param {string} dirname 
 */
let osRequire = (dirname) => {
    if (!path.isAbsolute(dirname)) {
        dirname = path.resolve(path.dirname(getCallerFileName()), dirname);
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
        dirname = path.resolve(path.dirname(getCallerFileName()), dirname);
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

module.exports = {
    currentPackage,
    inExists,
    inRead,
    inRequire,
    inRequireDir,
    inResolve,
    osRequire,
    requireDir,
    'existsInPackage': inExists,
    'readInPackage': inRead,
    'requireInPackage': inRequire,
    'requireDirInPackage': inRequireDir,
    'resolveInPackage': inResolve,
};