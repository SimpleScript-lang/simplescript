'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    
    /* NPM */
    
    /* in-package */
    , Dir = require('./class/Dir')
    , syncing = require('./syncing')

    /* in-file */
    ;

class SyncDir extends Dir {
    constructor(base) {
        super(base);
        Object.assign(this, syncing);
    }
}

module.exports = SyncDir;