'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

	/* NPM */
	, noda = require('noda')
    
	/* in-package */
	, date_format = noda.inRequire('mysql')
	
    ;

describe('mysql date_format, unescape', () => {
	// 依当时时间创建日期对象，GMT 字段取决于宿主机的时区设定而可能与注释中不同。
	
	let d1 = new Date(2000, 0, 1, 13, 14, 6, 52);
	// Sat Jan 01 2000 13:26:09 GMT+0800 (CST)

	let d2 = new Date(2000, 10, 1, 0, 0, 0, 0);
	// Wed Nov 01 2000 00:00:00 GMT+0800 (CST)

	let d3 = new Date('0990-10-31');
	
	it('%a Abbreviated weekday name (Sun..Sat)', () => {
		assert.strictEqual(date_format(d1, '%a'), 'Sat');
	});

	it('%b Abbreviated month name (Jan..Dec)', () => {
		assert.strictEqual(date_format(d1, '%b'), 'Jan');
	});

	it('%c Month, numeric (1..12)', () => {
		assert.strictEqual(date_format(d1, '%c'), '1');
	});

	it('%D Day of the month with English suffix (1st, 2nd, 3rd, …)', () => {
		assert.strictEqual(date_format(d1, '%D'), '1st');
	});

	it('%d Day of the month, numeric (01..31)', () => {
		assert.strictEqual(date_format(d1, '%d'), '01');
	});

	it('%e Day of the month, numeric (1..31)', () => {
		assert.strictEqual(date_format(d1, '%e'), '1');
	});

	it('%f Microseconds (000000..999999)', () => {
		assert.strictEqual(date_format(d1, '%f'), '052000');
	});

	it('%H Hour (00..23)', () => {
		assert.strictEqual(date_format(d1, '%H'), '13');
	});

	it('%h Hour (01..12)', () => {
		assert.strictEqual(date_format(d1, '%h'), '01');
		assert.strictEqual(date_format(d2, '%h'), '12');
	});

	it('%I Hour (01..12)', () => {
		assert.strictEqual(date_format(d1, '%I'), '01');
		assert.strictEqual(date_format(d2, '%I'), '12');
	});

	it('%i Minutes, numeric (00..59)', () => {
		assert.strictEqual(date_format(d1, '%i'), '14');
		assert.strictEqual(date_format(d2, '%i'), '00');
	});

	it('%j Day of year (001..366)', () => {
		assert.strictEqual(date_format(d1, '%j'), '001');
		assert.strictEqual(date_format(d2, '%j'), '306');
	});

	it('%k Hour (0..23)', () => {
		assert.strictEqual(date_format(d1, '%k'), '13');
		assert.strictEqual(date_format(d2, '%k'), '0');
	});

	it('%l Hour (1..12)', () => {
		assert.strictEqual(date_format(d1, '%l'), '1');
		assert.strictEqual(date_format(d2, '%l'), '12');
	});
	
	it('%M Month name (January..December)', () => {
		assert.strictEqual(date_format(d1, '%M'), 'January');
		assert.strictEqual(date_format(d2, '%M'), 'November');
	});

	it('%m Month, numeric (01..12)', () => {
		assert.strictEqual(date_format(d1, '%m'), '01');
	});

	it('%p AM or PM', () => {
		assert.strictEqual(date_format(d1, '%p'), 'PM');
		assert.strictEqual(date_format(d2, '%p'), 'AM');
	});

	it('%r Time, 12-hour (hh:mm:ss followed by AM or PM)', () => {
		assert.strictEqual(date_format(d1, '%r'), '01:14:06 PM');
	});

	it('%S Seconds (00..59)', () => {
		assert.strictEqual(date_format(d1, '%S'), '06');
		assert.strictEqual(date_format(d2, '%S'), '00');
	});

	it('%s Seconds (00..59)', () => {
		assert.strictEqual(date_format(d1, '%s'), '06');
		assert.strictEqual(date_format(d2, '%s'), '00');
	});

	it('%T Time, 24-hour (hh:mm:ss)', () => {
		assert.strictEqual(date_format(d1, '%T'), '13:14:06');
	});

	it('%U Week (00..53), where Sunday is the first day of the week; WEEK() mode 0', () => {
		assert.strictEqual(date_format(new Date(2000, 0, 1), '%U'), '00');
		assert.strictEqual(date_format(new Date(2000, 0, 2), '%U'), '01');
		assert.strictEqual(date_format(new Date(2000, 0, 3), '%U'), '01');
	});

	it('%u Week (00..53), where Monday is the first day of the week; WEEK() mode 1', () => {
		assert.strictEqual(date_format(new Date(2000, 0, 1), '%u'), '00');
		assert.strictEqual(date_format(new Date(2000, 0, 2), '%u'), '00');
		assert.strictEqual(date_format(new Date(2000, 0, 3), '%u'), '01');
	});

	it('%V Week (01..53), where Sunday is the first day of the week; WEEK() mode 2;', () => {
		assert.strictEqual(date_format(new Date(2000, 0, 1), '%V'), '52');
		assert.strictEqual(date_format(new Date(2000, 0, 2), '%V'), '01');
	});

	it('%v Week (01..53), where Monday is the first day of the week; WEEK() mode 3;', () => {
		assert.strictEqual(date_format(new Date(2000, 0, 2), '%v'), '52');
		assert.strictEqual(date_format(new Date(2000, 0, 3), '%v'), '01');
	});

	it('%X Year for the week where Sunday is the first day of the week, numeric, four digits', () => {
		assert.strictEqual(date_format(new Date(2000, 0, 1), '%X'), '1999');
		assert.strictEqual(date_format(new Date(2000, 0, 2), '%X'), '2000');
	});

	it('%x Year for the week, where Monday is the first day of the week, numeric, four digits', () => {
		assert.strictEqual(date_format(new Date(2000, 0, 2), '%x'), '1999');
		assert.strictEqual(date_format(new Date(2000, 0, 3), '%x'), '2000');
	});

	it('%W Weekday name (Sunday..Saturday)', () => {
		assert.strictEqual(date_format(d1, '%W'), 'Saturday');
	});

	it('%w Day of the week (0=Sunday..6=Saturday)', () => {
		assert.strictEqual(date_format(d1, '%w'), '6');
	});

	it('%Y Year, numeric, four digits', () => {
		assert.strictEqual(date_format(d1, '%Y'), '2000');
		assert.strictEqual(date_format(d3, '%Y'), '0990');
	});

	it('%y Year, numeric (two digits)', () => {
		assert.strictEqual(date_format(d1, '%y'), '00');
		assert.strictEqual(date_format(d3, '%y'), '90');
	});

	it('predefined DATE.USA', () => {
		assert.strictEqual(date_format(d2, date_format.DATE.USA), '11.01.2000');
	});
	
});