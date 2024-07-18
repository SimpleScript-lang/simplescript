'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')
    
    /* NPM */
    
    /* in-package */

    /* in-file */

    , exists = pathname => {
        try {
            fs.lstatSync(pathname);
            return true;
        }
        catch (ex) {
            return false;
        }
    }
    
    , mkd = dirname => {
        if (!fs.existsSync(dirname)) {    
            let parent = path.resolve(dirname, '..');
            mkd(parent);
            fs.mkdirSync(dirname);
        }
    }

    , mkd_parent = pathname => {
        mkd(path.dirname(pathname));
    }

    , rmfr = pathname => {
        if (exists(pathname)) {
            if (fs.lstatSync(pathname).isDirectory()) {
                // 删除目录内容。
                fs.readdirSync(pathname).forEach(filename => rmfr(path.join(pathname, filename)));
    
                // 删除目录。
                fs.rmdirSync(pathname);
            }
            else {
                // 删除文件。
                fs.unlinkSync(pathname);
            }
        }
    }
    
    , touch = filename => {
        // ATTENTION: It maybe a diretory instead of a file.
        if (fs.existsSync(filename)) {
            return;
        }

        mkd_parent(filename);
        fs.writeFileSync(filename, Buffer.alloc(0));
        return;
    }
    ;

const syncing = {};

/**
 * @param  {string}        filename
 * @param  {string|Buffer} data
 */
syncing.appendFile = function(filename, data) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    mkd_parent(filename);
    fs.appendFileSync(filename, data);
    return;
};

/**
 * @param  {string}  src
 * @param  {string}  dest
 */
syncing.copy = function(src, dest, _resolved = false) {
    if (this.resolve && !_resolved) {
        src = this.resolve(src);
        dest = this.resolve(dest);
    }

    if (fs.lstatSync(src).isDirectory()) {
        let names = fs.readdirSync(src);
        for (let i = 0; i < names.length; i++) {
            syncing.copy(path.join(src, names[i]),  path.join(dest, names[i]), true);
        }

        /**
         * Create an empty directory.
         */
        if (names.length == 0) {
            syncing.mkd(dest);
        }
    }
    else {
        mkd_parent(dest);
        fs.copyFileSync(src, dest);
    }
}


/**
 * @param  {string}  srcFilename
 * @param  {string}  destFilename
 * @param  {number} [flags]          - see fs.copyFile() for details about flags.
 */
syncing.copyFile = function(srcFilename, destFilename, flags) {
    if (this.resolve) {
        srcFilename = this.resolve(srcFilename);
        destFilename = this.resolve(destFilename);
    }

    mkd_parent(destFilename);
    fs.copyFileSync(srcFilename, destFilename, flags);
    return;
};

/**
 * @param  {string}  filename
 * @param  {Object} [options]   - see fs.createWriteStream() for details about options.
 */
syncing.createWriteStream = function(filename, options) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    mkd_parent(filename);
    return fs.createWriteStream(filename, options);
};

/**
 * @param {*} filename 
 * @return {boolean}
 */
syncing.exists = function(filename) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    return exists(filename);
};

/**
 * @param  {string} existingPath
 * @param  {string} newPath
 */
syncing.link = function(existingPath, newPath) {
    if (this.resolve) {
        existingPath = this.resolve(existingPath);
        newPath = this.resolve(newPath);
    }

    mkd_parent(newPath);
    fs.linkSync(existingPath, newPath);
    return;
};

/**
 * Create target diretory and its parent directroies if they not exist.
 * @param  {string} dirname
 */
syncing.mkd = function(dirname) {
    if (this.resolve) {
        dirname = this.resolve(dirname);
    }

    mkd(dirname);
    return;
};

/**
 * @param  {string}  dirname
 * @param  {string} [prefix]
 */
syncing.mkd_temp = function(dirname, prefix) {
    if (this.resolve) {
        dirname = this.resolve(dirname);
    }

    mkd(dirname);
    if (prefix) {
        prefix = path.join(dirname, prefix);
    }
    else {
        // Append seperator character at the end of dirname if no prefix needed.
        // Otherwise the last part of dirname will be regarded as prefix by fs.mkdtemp().
        prefix = path.join(dirname, path.sep);
    }
    fs.mkdtempSync(prefix);
    return;
};

/**
 * @param  {string} pathname
 */
syncing.mkd_parent = function(pathname) {
    if (this.resolve) {
        pathname = this.resolve(pathname);
    }

    mkd_parent(pathname);
    return;  
};

/**
 * @param  {string}         filename
 * @param  {string|number} [flags='r']
 * @param  {integer}       [mode]
 */
syncing.open = function(filename, flags = 'r', mode) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    touch(filename);
    return fs.openSync(filename, flags, mode);
};

/**
 * Read file content.
 * @param {string}  filename 
 * @param {string} [encoding]
 * @return {string | Buffer}
 */
syncing.readFile = function(filename, encoding) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    return fs.readFileSync(filename, encoding);
};

/**
 * @param {string}  filename 
 * @param {string} [encoding]
 */
syncing.readJSON = function(filename, encoding = 'utf8') {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    let content = fs.readFileSync(filename, encoding);
    return JSON.parse(content);
};

/**
 * @param {string}  dirname 
 * @return {string[]}
 */
syncing.readdir = function(dirname) {
    if (this.resolve) {
        dirname = this.resolve(dirname);
    }

    return fs.readdirSync(dirname);
};

/**
 * @param  {string} oldPath
 * @param  {string} newPath
 */
syncing.rename = function(oldPath, newPath) {
    if (this.resolve) {
        oldPath = this.resolve(oldPath);
        newPath = this.resolve(newPath);
    }

    mkd_parent(newPath);
    fs.renameSync(oldPath, newPath);
    return;
};

/**
 * @param  {string} pathname
 */
syncing.rmfr = function(pathname) {
    if (this.resolve) {
        pathname = this.resolve(pathname);
    }

    rmfr(pathname);
    return;
};

/**
 * @param  {string}  target 
 * @param  {string}  pathname 
 * @param  {string} [type] 
 */
syncing.symlink = function(target, pathname, type) {
    if (this.resolve) {
        target = this.resolve(target);
        pathname = this.resolve(pathname);
    }
    else {
        /**
         * ATTENTION: Built-in `fs.symlink(target, path)` will 
         * create a symbol link at `path` and point it to `target` 
         * without resovling, whether or not the target really exists.
         * 
         * 注意：内置的 `fs.symlink(target, path)` 方法将在 `path` 指定的位置
         * 创建一个符号链接，并将它指向 `target`，而不管 `target` 是否真的存在，
         * 也不会解析其完整路径。
         */
        target = path.resolve(target);
    }
    mkd_parent(pathname);
    fs.symlinkSync(target, pathname, type);
    return;
};

/**
 * @param  {string} filename
 */
syncing.touch = function(filename) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    touch(filename);
    return;
};

/**
 * @param  {string} filename
 * @param  {string|Buffer|TypedArray|DataView} data - see fs.writeFile() for details about data.
 */
syncing.writeFile = function(filename, data) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }
    
    mkd_parent(filename);
    fs.writeFileSync(filename, data);
    return;
};

/**
 * @param  {string} filename
 * @param  {JSON}   json
 */
syncing.writeJSON = function(filename, json) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }
    
    mkd_parent(filename);
    let data = JSON.stringify(json, null, 4);
    fs.writeFileSync(filename, data);
    return;
};


module.exports = syncing;