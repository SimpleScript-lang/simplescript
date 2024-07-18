'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')
    , util = require('util')
    
    /* NPM */
    
    /* in-package */

    /* in-file */
    , appendFile  = util.promisify(fs.appendFile)
    , copyFile    = util.promisify(fs.copyFile)
    , link        = util.promisify(fs.link)
    , lstat       = util.promisify(fs.lstat)
    , mkdir       = util.promisify(fs.mkdir)
    , mkdtemp     = util.promisify(fs.mkdtemp)
    , open        = util.promisify(fs.open)
    , readdir     = util.promisify(fs.readdir)
    , readFile    = util.promisify(fs.readFile)    
    , rename      = util.promisify(fs.rename)
    , rmdir       = util.promisify(fs.rmdir)
    , stat        = util.promisify(fs.stat)
    , symlink     = util.promisify(fs.symlink)
    , unlink      = util.promisify(fs.unlink)
    , writeFile   = util.promisify(fs.writeFile)

    , exists = pathname => {
        return lstat(pathname).then(() => true, () => false);
    }
    
    , mkd = async dirname => {
        if (! await exists(dirname)) { 
            let parent = path.resolve(dirname, '..');
            await mkd(parent);
            await mkdir(dirname).catch(err => {
                // 异步执行可能存在这样的问题，即在判断的时候，目录确实不存在，
                // 但当创建的时候，它又已经存在了。故此类错误直接忽略。
                if (err.code == 'EEXIST') return null;
                else throw err;
            });
        }
    }

    , mkd_parent = pathname => {
        return mkd(path.dirname(pathname));
    }

    , rmfr = async pathname => {
        if (await exists(pathname)) {
            if ((await lstat(pathname)).isDirectory()) {
                // 删除目录内容。
                let names = await readdir(pathname);
                for (let i = 0; i < names.length; i++) {
                    await rmfr(path.join(pathname, names[i]));
                }
    
                // 删除目录。
                await rmdir(pathname);
            }
            else {
                // 删除文件。
                await unlink(pathname);
            }
        }
    }
    
    , touch = async filename => {
        // ATTENTION: It maybe a diretory instead of a file.
        if (await exists(filename)) {
            return;
        }

        await mkd_parent(filename);
        await writeFile(filename, Buffer.alloc(0));
    }
    ;

const asyncing = {};

/**
 * @param  {string}        filename
 * @param  {string|Buffer} data
 */
asyncing.appendFile = async function(filename, data) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    await mkd_parent(filename);
    await appendFile(filename, data);
};

/**
 * @param  {string}  srcFilename
 * @param  {string}  destFilename
 * @param  {number} [flags]          - see fs.copyFile() for details about flags.
 */
asyncing.copyFile = async function(srcFilename, destFilename, flags) {
    if (this.resolve) {
        srcFilename = this.resolve(srcFilename);
        destFilename = this.resolve(destFilename);
    }

    await mkd_parent(destFilename);
    await copyFile(srcFilename, destFilename, flags);
};

/**
 * @param  {string}  src
 * @param  {string}  dest
 */
asyncing.copy = async function(src, dest, _resolved = false) {
    if (this.resolve && !_resolved) {
        src = this.resolve(src);
        dest = this.resolve(dest);
    }

    if ((await lstat(src)).isDirectory()) {
        let names = await readdir(src);
        for (let i = 0; i < names.length; i++) {
            await asyncing.copy(path.join(src, names[i]),  path.join(dest, names[i]), true);
        }

        /**
         * Create an empty directory.
         */
        if (names.length == 0) {
            await asyncing.mkd(dest);
        }
    }
    else {
        await mkd_parent(dest);
        await copyFile(src, dest);
    }
}

/**
 * @param  {string}  filename
 * @param  {Object} [options]   - see fs.createWriteStream() for details about options.
 */
asyncing.createWriteStream = async function(filename, options) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    await mkd_parent(filename);
    return fs.createWriteStream(filename, options);
};
    
/**
 * @param {*} filename 
 * @return {boolean}
 */
asyncing.exists = async function(filename) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    return await exists(filename);
};

/**
 * @param  {string} existingPath
 * @param  {string} newPath
 */
asyncing.link = async function(existingPath, newPath) {
    if (this.resolve) {
        existingPath = this.resolve(existingPath);
        newPath = this.resolve(newPath);
    }

    await mkd_parent(newPath);
    await link(existingPath, newPath);
};

/**
 * Create target diretory and its parent directroies if they not exist.
 * @param  {string} dirname
 */
asyncing.mkd = async function(dirname) {
    if (this.resolve) {
        dirname = this.resolve(dirname);
    }

    await mkd(dirname);
};

/**
 * @param  {string}  dirname
 * @param  {string} [prefix]
 */
asyncing.mkd_temp = async function(dirname, prefix) {
    if (this.resolve) {
        dirname = this.resolve(dirname);
    }

    await mkd(dirname);
    if (prefix) {
        prefix = path.join(dirname, prefix);
    }
    else {
        // Append seperator character at the end of dirname if no prefix needed.
        // Otherwise the last part of dirname will be regarded as prefix by fs.mkdtemp().
        prefix = path.join(dirname, path.sep);
    }
    await mkdtemp(prefix);
};

/**
 * @param  {string} pathname
 */
asyncing.mkd_parent = async function(pathname) {
    if (this.resolve) {
        pathname = this.resolve(pathname);
    }

    await mkd_parent(pathname);
};

/**
 * @param  {string}         filename
 * @param  {string|number} [flags='r']
 * @param  {integer}       [mode]
 */
asyncing.open = async function(filename, flags = 'r', mode) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }
    
    await touch(filename);
    return await open(filename, flags, mode);
};

/**
 * Read file content.
 * @param {string}  filename 
 * @param {string} [encoding]
 * @return {string | Buffer}
 */
asyncing.readFile = async function(filename, encoding) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    return await readFile(filename, encoding);
};

/**
 * @param {string}  filename 
 * @param {string} [encoding]
 * @return {JSON}
 */
asyncing.readJSON = async function(filename, encoding = 'utf8') {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    let content = await readFile(filename, encoding);
    return JSON.parse(content);
};

/**
 * @param {string}  dirname 
 * @return {string[]}
 */
asyncing.readdir = async function(dirname) {
    if (this.resolve) {
        dirname = this.resolve(dirname);
    }
    return await readdir(dirname);
};

/**
 * @param  {string} oldPath
 * @param  {string} newPath
 */
asyncing.rename = async function(oldPath, newPath) {
    if (this.resolve) {
        oldPath = this.resolve(oldPath);
        newPath = this.resolve(newPath);
    }

    await mkd_parent(newPath);
    await rename(oldPath, newPath);
};

/**
 * @param  {string} pathname
 */
asyncing.rmfr = async function(pathname) {
    if (this.resolve) {
        pathname = this.resolve(pathname);
    }

    await rmfr(pathname);
};

/**
 * @param  {string}  target 
 * @param  {string}  pathname 
 * @param  {string} [type] 
 */
asyncing.symlink = async function(target, pathname, type) {
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
    await mkd_parent(pathname);
    await symlink(target, pathname, type);
    return;
};

/**
 * @param  {string} filename
 */
asyncing.touch = async function(filename) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    await touch(filename);
};

/**
 * @param  {string} filename
 * @param  {string|Buffer|TypedArray|DataView} data - see fs.writeFile() for details about data.
 */
asyncing.writeFile = async function(filename, data) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }
    
    await mkd_parent(filename);
    await writeFile(filename, data);
};

/**
 * @param  {string} filename
 * @param  {JSON} data
 */
asyncing.writeJSON = async function(filename, data) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }
    
    await mkd_parent(filename);
    await writeFile(filename, JSON.stringify(data, null, 4));
};

module.exports = asyncing;