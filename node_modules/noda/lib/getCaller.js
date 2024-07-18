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
    let stack = err.stack[2 + depth];    

    // console.log(stack.getScriptNameOrSourceURL());
    let info = {
        filename  : stack.getFileName(),
        line      : stack.getLineNumber(),
        column    : stack.getColumnNumber(),
        position  : stack.getPosition(),

    };
    // console.log(info);    
    
    Error.prepareStackTrace = prepareStackTrace;

    return info;
};