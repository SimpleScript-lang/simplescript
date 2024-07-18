'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	, path = require('path')

	/* NPM */

	/* in-package */
	;

function depth_first(cwd, pathname, depth) {
	if (!depth) depth = Number.POSITIVE_INFINITY;

	let realPathname = null;
	let p = path.join(cwd, pathname);
	if (fs.existsSync(p)) {
		realPathname = p
	}
	else if (--depth > 0) {
		let names = fs.readdirSync(cwd);
		for (let i = 0, p; !realPathname && i < names.length; i++) {
			p = path.join(cwd, names[i]);
			if (fs.statSync(p).isDirectory()) {
				realPathname = depth_first(p, pathname, depth);
			}
		}
	}
	return realPathname;
}

function breadth_first(cwd, pathname, depth) {
	if (!depth) depth = Number.POSITIVE_INFINITY;

	let realPathname = null;
	let dirnames = null, subdirnames = [ cwd ];
	do {
		dirnames = subdirnames;
		subdirnames = [];

		for (let i = 0; !realPathname && i < dirnames.length; i++) {
			let dirname = dirnames[i];
			let p = path.join(dirname, pathname);
			if (fs.existsSync(p)) {
				realPathname = p;
			}
			else {
				let names = fs.readdirSync(dirname);
				names.forEach(name => {
					p = path.join(dirname, name);
					if (fs.statSync(p).isDirectory()) {
						subdirnames.push(p);
					}
				});
			}
		}
	} while(--depth > 0 && !realPathname && subdirnames.length > 0)

	return realPathname;
}

module.exports = { depth_first, breadth_first };