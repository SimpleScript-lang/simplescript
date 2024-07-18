'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

	/* NPM */
	, noda = require('noda')
    
	/* in-package */
	, dafo = noda.inRequire('index')
	
    ;

describe('dafo', () => {
	// 依当时时间创建日期对象，GMT 字段取决于宿主机的时区设定而可能与注释中不同。

	let d1 = new Date(2000, 0, 1, 13, 14, 6, 52);
	// Sat Jan 01 2000 13:26:09 GMT+0800 (CST)

	let d2 = new Date(2000, 10, 1, 0, 0, 0, 0);
	// Wed Nov 01 2000 00:00:00 GMT+0800 (CST)

	let WEEK_MODE_TEST_UNITS = [
		{ date: new Date(2018,  5, 14), mode: 0, year: 2018, week: 23 },
		{ date: new Date(2018,  0,  2), mode: 0, year: 2018, week:  0 },
		{ date: new Date(2017,  0,  2), mode: 0, year: 2017, week:  1 },

		{ date: new Date(2018,  5, 14), mode: 1, year: 2018, week:  24 },
		{ date: new Date(2018,  0,  2), mode: 1, year: 2018, week:   1 },
		{ date: new Date(2017,  0,  1), mode: 1, year: 2017, week:   0 },
		{ date: new Date(2017,  0,  9), mode: 1, year: 2017, week:   2 },
		{ date: new Date(2017,  0,  8), mode: 1, year: 2017, week:   1 },
		{ date: new Date(2017,  0,  2), mode: 1, year: 2017, week:   1 },

		{ date: new Date(2018,  5, 14), mode: 2, year: 2018, week:  23 },
		{ date: new Date(2018,  0,  7), mode: 2, year: 2018, week:   1 },
		{ date: new Date(2018,  0,  6), mode: 2, year: 2017, week:  53 },
		{ date: new Date(2018,  0,  2), mode: 2, year: 2017, week:  53 },
		{ date: new Date(2017,  0,  2), mode: 2, year: 2017, week:   1 },

		{ date: new Date(2018,  5, 14), mode: 3, year: 2018, week:  24 },
		{ date: new Date(2018,  0,  8), mode: 3, year: 2018, week:   2 },
		{ date: new Date(2018,  0,  7), mode: 3, year: 2018, week:   1 },
		{ date: new Date(2018,  0,  1), mode: 3, year: 2018, week:   1 },
		{ date: new Date(2017,  0,  1), mode: 3, year: 2016, week:  52 },

		{ date: new Date(2018,  5, 14), mode: 4, year: 2018, week:  24 },
		{ date: new Date(2018,  0,  7), mode: 4, year: 2018, week:   2 },
		{ date: new Date(2018,  0,  6), mode: 4, year: 2018, week:   1 },
		{ date: new Date(2018,  0,  1), mode: 4, year: 2018, week:   1 },
		{ date: new Date(2016,  0,  3), mode: 4, year: 2016, week:   1 },
		{ date: new Date(2016,  0,  1), mode: 4, year: 2016, week:   0 },

		{ date: new Date(2018,  5, 14), mode: 5, year: 2018, week:  24 },
		{ date: new Date(2018,  0,  8), mode: 5, year: 2018, week:   2 },
		{ date: new Date(2018,  0,  7), mode: 5, year: 2018, week:   1 },
		{ date: new Date(2018,  0,  1), mode: 5, year: 2018, week:   1 },
		{ date: new Date(2017,  0,  2), mode: 5, year: 2017, week:   1 },
		{ date: new Date(2017,  0,  1), mode: 5, year: 2017, week:   0 },

		{ date: new Date(2018,  5, 14), mode: 6, year: 2018, week:  24 },
		{ date: new Date(2018,  0,  7), mode: 6, year: 2018, week:   2 },
		{ date: new Date(2018,  0,  1), mode: 6, year: 2018, week:   1 },
		{ date: new Date(2016,  0,  3), mode: 6, year: 2016, week:   1 },
		{ date: new Date(2016,  0,  2), mode: 6, year: 2015, week:  52 },
		{ date: new Date(2016,  0,  1), mode: 6, year: 2015, week:  52 },

		{ date: new Date(2018,  5, 14), mode: 7, year: 2018, week:  24 },
		{ date: new Date(2018,  0,  8), mode: 7, year: 2018, week:   2 },
		{ date: new Date(2018,  0,  7), mode: 7, year: 2018, week:   1 },
		{ date: new Date(2018,  0,  1), mode: 7, year: 2018, week:   1 },
		{ date: new Date(2016,  0,  4), mode: 7, year: 2016, week:   1 },
		{ date: new Date(2016,  0,  3), mode: 7, year: 2015, week:  52 },
		{ date: new Date(2016,  0,  1), mode: 7, year: 2015, week:  52 },
	];

	it('getDayOfYear()', () => {
		assert.equal(dafo.getDayOfYear(d1), 1);
		assert.equal(dafo.getDayOfYear(d2), 306);
	});

	it('getMonthDays()', () => {
		assert.equal(dafo.getMonthDays(new Date(2000, 0, 1)), 31);
		assert.equal(dafo.getMonthDays(new Date(2000, 1, 1)), 29);
		assert.equal(dafo.getMonthDays(new Date(2000, 3, 1)), 30);
		assert.equal(dafo.getMonthDays(new Date(2001, 1, 1)), 28);
	});

	it('getWeekOfYear()', () => {
		WEEK_MODE_TEST_UNITS.forEach(unit => {
			let ret = dafo.getWeekOfYear(unit.date, unit.mode);
			assert.equal(ret, unit.week);
		});
	});

	it('getWeekRange()', () => {
		let range = dafo.getWeekRange({ year: 2018, week: 1, mode: 0 });
		assert.equal(range.first.getDate(), 7);
		assert.equal(range.last.getDate(), 13);
	});
	
	it('getYearWeek()', () => {
		WEEK_MODE_TEST_UNITS.forEach(unit => {
			let ret = dafo.getYearWeek(unit.date, unit.mode);
			assert.equal(ret.year, unit.year);
			assert.equal(ret.week, unit.week);
		});
	});

	it('isLeapYear()', () => {
		assert( dafo.isLeapYear(new Date(2000, 0, 1)));
		assert( dafo.isLeapYear(new Date(2004, 0, 1)));
		assert(!dafo.isLeapYear(new Date(1900, 0, 1)));
		assert(!dafo.isLeapYear(new Date(2001, 0, 1)));
	});
	
});