'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , util = require('util')
    
    /* NPM */
    
    /* in-package */
    , asyncing = require('./asyncing')
    , Dir = require('./class/Dir')

    /* in-file */
    ;

class AsyncDir extends Dir {
    constructor(base) {
        super(base);
        Object.assign(this, asyncing);
    }
}

module.exports = AsyncDir;