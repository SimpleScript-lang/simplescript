'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	, path = require('path')
	
	/* NPM */
	
	/* in-package */
	;

let packageOf = function(id, mod) {
	let packageJson = null;
	if (!mod) mod = module;
	
	let pathname = require.resolve(id, mod.paths);
	let dirname = fs.statSync(pathname).isDirectory() ? pathname : path.dirname(pathname);

    do {
		let packageJsonPath = path.join(dirname, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            packageJson = require(packageJsonPath);
            break;
        }

        if (dirname == (dirname = path.dirname(dirname))) {
            throw new Error('package.json not found');
        }
    } while(1);
    
    return packageJson;
};

module.exports = packageOf;