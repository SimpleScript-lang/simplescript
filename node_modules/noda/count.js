/**
 * @author Youngoat@163.com
 * @create 2020-12-11
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	, getCaller = require('./lib/getCaller');
	;

const _counters = {};

module.exports = function() {
	let info = getCaller();
	let sn = `${info.filename}:${info.position}`;
	if (!_counters.hasOwnProperty(sn)) _counters[sn] = 0;
	return ++_counters[sn];
};

