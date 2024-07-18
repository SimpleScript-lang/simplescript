'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	, getYearWeek = require('./getYearWeek')
	;

function getWeekOfYear(d, mode = 0) {
	let ret = getYearWeek(d, mode);
	return ret.week;
}

module.exports = getWeekOfYear;