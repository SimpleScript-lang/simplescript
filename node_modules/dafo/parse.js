'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */

	/* in-file */
	, test = (fn, str, expected) => {
		if (fn(str)) {
			return true;
		}
		else {
			throw new Error(`${expected} expected but ${str} found`);
		}
	}

	, RE_NUM = /^\d+$/
	, isNumber = RE_NUM.test.bind(RE_NUM)

	, between = function(str, from, to) {
		// If only 2 arguments (from, to) passed in, 
		// return a new function based on the fixed range.
		if (arguments.length == 2) {
			return str => between(str, arguments[0], arguments[1]);
		}

		if (!isNumber(str)) {
			return false;
		}
		else {
			let n = parseInt(str);
			return from <= n && n <= to;
		}
	}
	;

const PARSERS = {
	'Y' : (str, info) => {
		let y4 = str.slice(0, 4);
		if (test(isNumber, y4, 'year (e.g. 1987)')) {
			info.Year = parseInt(y4);
		}
		return str.slice(4);
	},

	'm' : (str, info) => {
		let m2 = str.slice(0, 2);
		if (test(between(1, 12), m2, 'month (01..12)')) {
			info.Month = parseInt(m2) - 1;
		}
		return str.slice(2);
	},

	'd' : (str, info) => {
		let d2 = str.slice(0, 2);
		if (test(between(1, 31), d2, 'date (01..31)')) {
			info.Date = parseInt(d2);
		}
		return str.slice(2);
	},

	'H' : (str, info) => {
		let hour24 = str.slice(0, 2);
		if (test(between(0, 23), hour24, '24-hour (00..23)')) {
			info.Hours = parseInt(hour24);
		}
		return str.slice(2);
	},

	'i' : (str, info) => {
		let minutes = str.slice(0, 2);
		if (test(between(0, 59), minutes, 'minutes (00..59)')) {
			info.Minutes = parseInt(minutes);
		}
		return str.slice(2);
	},

	's' : (str, info) => {
		let seconds = str.slice(0, 2);
		if (test(between(0, 59), seconds, 'seconds (00..59)')) {
			info.Seconds = parseInt(seconds);
		}
		return str.slice(2);
	},
}

/**
 * Parse date string and return a Date object.
 * @param {string} date 
 * @param {string} format 
 * @return {Date | null}
 */
function parse(date, format) {
	let info = {};
	LOOP_FORMAT: while (format.length) {		
		for (let placeholder in PARSERS) {
			if (format.startsWith(placeholder)) {
				let parser = PARSERS[placeholder];
				try {
					date = parser(date, info);
				}
				catch(ex) {
					info = null;
					break LOOP_FORMAT;
				}

				format = format.slice(placeholder.length);
				continue LOOP_FORMAT;
			}
		}

		// If none of placeholders matched, the char in `date` string should 
		// equal to the char in `format` at the same position.
		if (date[0] == format[0]) {
			date = date.slice(1);
			format = format.slice(1);
		}
		else {
			info = null;
			break;
		}
	}

	let d = null;
	if (info) {
		d = new Date();
		for (let name in info) {
			d[`set${name}`](info[name]);
		}
	}
	return d;
}

module.exports = parse;