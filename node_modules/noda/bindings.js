'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, path = require('path')
	
	/* NPM */
	
	/* in-package */
	, getCallerPackageDir = require('./lib/getCallerPackageDir')
    ;

function bindings(name) {
	let dirname = getCallerPackageDir();
	let pathname = path.join(dirname, 'build', 'Release', name);
	return require(pathname);
}

module.exports = bindings;
