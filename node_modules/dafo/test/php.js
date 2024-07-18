'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

	/* NPM */
	, noda = require('noda')
    
	/* in-package */
	, date_format = noda.inRequire('php')
	
    ;

describe('php ', () => {
	// 依当时时间创建日期对象，GMT 字段取决于宿主机的时区设定而可能与注释中不同。
	
	let d1 = new Date(2000, 0, 1, 13, 14, 6, 52);
	// Sat Jan 01 2000 13:14:06 GMT+0800 (CST)

	let d2 = new Date(2000, 10, 1, 0, 0, 0, 0);
	// Wed Nov 01 2000 00:00:00 GMT+0800 (CST)

	let d3 = new Date('0990-10-31');
	
	it('d, Day of the month, 2 digits with leading zeros, 01 to 31', () => {
		assert.strictEqual(date_format(d1, 'd'), '01');
	});

	it('D, A textual representation of a day, three letters, Mon through Sun', () => {
		assert.strictEqual(date_format(d1, 'D'), 'Sat');
	});

	it('j, Day of the month without leading zeros, 1 to 31', () => {
		assert.strictEqual(date_format(d1, 'j'), '1');
	});
	
	it('l, A full textual representation of the day of the week, Sunday through Saturday', () => {
		assert.strictEqual(date_format(d1, 'l'), 'Saturday');
	});
	
	it('N, ISO-8601 numeric representation of the day of the week (added in PHP 5.1.0)', () => {
		assert.strictEqual(date_format(d1, 'N'), '6');
		assert.strictEqual(date_format(new Date(2000, 0, 2), 'N'), '7');
	});

	it('S, English ordinal suffix for the day of the month, 2 characters, st, nd, rd or th. Works well with j', () => {
		assert.strictEqual(date_format(d1, 'S'), 'st');
	});

	it('w, Numeric representation of the day of the week, 0 (for Sunday) through 6 (for Saturday)', () => {
		assert.strictEqual(date_format(d1, 'w'), '6');
	});

	it('z, The day of the year (starting from 0)	0 through 365', () => {
		assert.strictEqual(date_format(d1, 'z'), '0');
	});

	it('W, ISO-8601 week number of year, weeks starting on Monday, Example: 42 (the 42nd week in the year)', () => {
		assert.strictEqual(date_format(new Date(2018,  5, 14), 'W'), '24');
		assert.strictEqual(date_format(new Date(2018,  0,  8), 'W'), '02');
		assert.strictEqual(date_format(new Date(2018,  0,  7), 'W'), '01');
		assert.strictEqual(date_format(new Date(2018,  0,  1), 'W'), '01');
		assert.strictEqual(date_format(new Date(2017,  0,  1), 'W'), '52');
	});
	
	it('F, A full textual representation of a month, such as January or March, January through December', () => {
		assert.strictEqual(date_format(d1, 'F'), 'January');
	});

	it('m, Numeric representation of a month, with leading zeros, 01 through 12', () => {
		assert.strictEqual(date_format(d1, 'm'), '01');
	});

	it('M, A short textual representation of a month, three letters, Jan through Dec', () => {
		assert.strictEqual(date_format(d1, 'M'), 'Jan');
	});

	it('n, Numeric representation of a month, without leading zeros, 1 through 12', () => {
		assert.strictEqual(date_format(d1, 'n'), '1');
	});

	it('t, Number of days in the given month, 28 through 31', () => {
		assert.strictEqual(date_format(d1, 't'), '31');
	});

	it('L, Whether it\'s a leap year, 1 if it is a leap year, 0 otherwise.', () => {
		assert.strictEqual(date_format(new Date(2004, 9, 1), 'L'), '1');
		assert.strictEqual(date_format(new Date(2003, 9, 1), 'L'), '0');
		assert.strictEqual(date_format(new Date(2000, 9, 1), 'L'), '1');
		assert.strictEqual(date_format(new Date(1900, 9, 1), 'L'), '0');
	});

	it('o, ISO-8601 week-numbering year', () => {
		assert.strictEqual(date_format(new Date(2018,  5, 14), 'o'), '2018');
		assert.strictEqual(date_format(new Date(2018,  0,  8), 'o'), '2018');
		assert.strictEqual(date_format(new Date(2018,  0,  7), 'o'), '2018');
		assert.strictEqual(date_format(new Date(2018,  0,  1), 'o'), '2018');
		assert.strictEqual(date_format(new Date(2017,  0,  1), 'o'), '2016');
		assert.strictEqual(date_format(d1, 'o'), '1999');
	});

	it('Y, A full numeric representation of a year, 4 digits, Examples: 1999 or 2003', () => {
		assert.strictEqual(date_format(d1, 'Y'), '2000');
	});

	it('y, A two digit representation of a year, Examples: 99 or 03', () => {
		assert.strictEqual(date_format(d1, 'y'), '00');
	});

	it('a, Lowercase Ante meridiem and Post meridiem, am or pm', () => {
		assert.strictEqual(date_format(d1, 'a'), 'pm');
		assert.strictEqual(date_format(d2, 'a'), 'am');
	});

	it('A, Uppercase Ante meridiem and Post meridiem, AM or PM', () => {
		assert.strictEqual(date_format(d1, 'A'), 'PM');
		assert.strictEqual(date_format(d2, 'A'), 'AM');
	});

	it.skip('B, Swatch Internet time, 000 through 999', () => {
		// TODO
	});

	it('g, 12-hour format of an hour without leading zeros, 1 through 12', () => {
		assert.strictEqual(date_format(d1, 'g'), '1');
		assert.strictEqual(date_format(d2, 'g'), '12');
	});

	it('G, 24-hour format of an hour without leading zeros, 0 through 23', () => {
		assert.strictEqual(date_format(d1, 'G'), '13');
		assert.strictEqual(date_format(d2, 'G'), '0');
	});

	it('h, 12-hour format of an hour with leading zeros, 01 through 12', () => {
		assert.strictEqual(date_format(d1, 'h'), '01');
		assert.strictEqual(date_format(d2, 'h'), '12');
	});

	it('H, 24-hour format of an hour with leading zeros, 00 through 23', () => {
		assert.strictEqual(date_format(d1, 'H'), '13');
		assert.strictEqual(date_format(d2, 'H'), '00');
	});

	it('i, Minutes with leading zeros, 00 to 59', () => {
		assert.strictEqual(date_format(d1, 'i'), '14');
		assert.strictEqual(date_format(d2, 'i'), '00');
	});

	it('s, Seconds, with leading zeros, 00 through 59', () => {
		assert.strictEqual(date_format(d1, 's'), '06');
		assert.strictEqual(date_format(d2, 's'), '00');
	});

	it('u, Microseconds (added in PHP 5.2.2)', () => {
		assert.strictEqual(date_format(d1, 'u'), '052000');
	});

	it('v, Milliseconds (added in PHP 7.0.0)', () => {
		assert.strictEqual(date_format(d1, 'v'), '052');
	});

	it('Y/m/d/H\\H/is', () => {
		console.log(date_format(d1, 'Y/m/d/H\\H/is'));
	});

	it.skip('e, Timezone identifier (added in PHP 5.1.0)	Examples: UTC, GMT, Atlantic/Azores', () => {
		// TODO
	});

	it.skip('I, Whether or not the date is in daylight saving time, 1 if Daylight Saving Time, 0 otherwise.', () => {
		// TODO
	});

	it.skip('O, Difference to Greenwich time (GMT) in hours, Example: +0200', () => {
		// TODO
	});

	it.skip('P, Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)	Example: +02:00', () => {
		// TODO
	});

	it.skip('T, Timezone abbreviation, Examples: EST, MDT ...', () => {
		// TODO
	});

	it.skip('Z, Timezone offset in seconds.', () => {
		// TODO
	});

	it.skip('c, ISO 8601 date (added in PHP 5)	2004-02-12T15:19:21+00:00', () => {
		// TODO
	});

	it.skip('r, » RFC 2822 formatted date, Example: Thu, 21 Dec 2000 16:01:07 +0200', () => {
		// TODO
	});

	it.skip('U, Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)', () => {
		// TODO
	});
});