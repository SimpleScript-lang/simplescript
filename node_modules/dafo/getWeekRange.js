'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	, getWeek1Offset = require('./lib/getWeek1Offset')
	;

/**
 * Get the range of week.
 * @param  {Object} options
 * @param  {number} options.year
 * @param  {number} options.week
 * @param  {number} options.mode
 */
function getWeekRange(options) {
	if (!options.mode) {
		options.mode = 0;
	}

	let offset = getWeek1Offset(options.year, options.mode);
	let Jan1st = new Date(options.year, 0, 1);
	let t = Jan1st.getTime() + (offset + (options.week - 1) * 7) * 86400 * 1000;
	
	let first = new Date(t);
	let last = new Date(t + 86400 * 6 * 1000);
	return { first, last };
}

module.exports = getWeekRange;