'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */
    ;

/**
 * @param  {int} [depth=0] set depth larger than 0 if the caller is not the direct one
 */
module.exports = function(depth) {
    // Uniform the arguments.
    if (arguments.length === 0) depth = 0;

    let prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function(err, stack) { return stack; };
    
    let err = new Error();
    let filename = err.stack[2 + depth].getFileName();
    
    Error.prepareStackTrace = prepareStackTrace;

    return filename;
};