/**
 * SEE
 *   PHP Manual > Function Reference > Date and Time Related Extensions > Date/Time > Date/Time Functions
 *   http://php.net/manual/en/function.date.php
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, noda = require('noda')
	
	/* in-package */
	, EN = noda.inRequire('EN')
	, ordinal = noda.inRequire('lib/ordinal')
	, getDayOfYear = noda.inRequire('getDayOfYear')
	, getMonthDays = noda.inRequire('getMonthDays')
	, getYearWeek = noda.inRequire('getYearWeek')
	, isLeapYear = noda.inRequire('isLeapYear')

	/* in-file */
	, formatI = (n, digits) => '0'.repeat(digits - (n+'').length) + n
	, getGMTOffset = (d) => {
		let offset = d.getTimezoneOffset();
		let sign = offset > 0 ? '-' : '+';
		offset = Math.abs(offset);
		let hours = Math.floor(offset / 60);
		let minutes = (offset % 60);
		return { sign, H: formatI(hours, 2), i: formatI(hours, 2) };
	}
	;

const ESCAPE_CHAR = '\\';

const FORMATTER = {
	// Day	---	---
	// d	Day of the month, 2 digits with leading zeros	01 to 31
	d : d => formatI(d.getDate(), 2),

	// D	A textual representation of a day, three letters	Mon through Sun
	D : d => EN.weekdayShortNames[d.getDay()],

	// j	Day of the month without leading zeros	1 to 31
	j : d => d.getDate(),

	// l (lowercase 'L')	A full textual representation of the day of the week	Sunday through Saturday
	l : d => EN.weekdayNames[d.getDay()],

	// N	ISO-8601 numeric representation of the day of the week (added in PHP 5.1.0)	1 (for Monday) through 7 (for Sunday)
	N : d => {
		let n = d.getDay();
		return (n == 0 ? 7 : n) + '';
	},

	// S	English ordinal suffix for the day of the month, 2 characters	st, nd, rd or th. Works well with j
	S : d => ordinal.suffix(d.getDate()),

	// w	Numeric representation of the day of the week	0 (for Sunday) through 6 (for Saturday)
	w : d => d.getDay() + '',
	
	// z	The day of the year (starting from 0)	0 through 365
	z : d => (getDayOfYear(d) - 1) + '',

	// Week	---	---
	// W	ISO-8601 week number of year, weeks starting on Monday	Example: 42 (the 42nd week in the year)
	W : d => formatI(getYearWeek(d, 3).week, 2),

	// Month	---	---
	// F	A full textual representation of a month, such as January or March	January through December
	F : d => EN.monthNames[d.getMonth()],

	// m	Numeric representation of a month, with leading zeros	01 through 12
	m : d => formatI(d.getMonth() + 1, 2),

	// M	A short textual representation of a month, three letters	Jan through Dec
	M : d => EN.monthShortNames[d.getMonth()],

	// n	Numeric representation of a month, without leading zeros	1 through 12
	n : d => (d.getMonth() + 1) + '',

	// t	Number of days in the given month	28 through 31
	t : d => getMonthDays(d) + '',

	// Year	---	---
	// L	Whether it's a leap year	1 if it is a leap year, 0 otherwise.
	L : d => isLeapYear(d) ? '1' : '0',

	// o	ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. (added in PHP 5.1.0)	Examples: 1999 or 2003
	o : d => getYearWeek(d, 3).year + '',

	// Y	A full numeric representation of a year, 4 digits	Examples: 1999 or 2003
	Y : d => formatI(d.getFullYear(), 4),

	// y	A two digit representation of a year	Examples: 99 or 03
	y : d => formatI(d.getFullYear(), 4).slice(-2),

	// Time	---	---
	// a	Lowercase Ante meridiem and Post meridiem	am or pm
	a : d => d.getHours() < 12 ? 'am' : 'pm',

	// A	Uppercase Ante meridiem and Post meridiem	AM or PM
	A : d => d.getHours() < 12 ? 'AM' : 'PM',

	// B	Swatch Internet time	000 through 999
	
	// g	12-hour format of an hour without leading zeros	1 through 12
	g : d => {
		let hours = d.getHours() % 12;
		return (hours == 0 ? 12 : hours) + '';
	},

	// G	24-hour format of an hour without leading zeros	0 through 23
	G : d => d.getHours() + '',

	// h	12-hour format of an hour with leading zeros	01 through 12
	h : d => {
		let hours = d.getHours() % 12;
		return formatI(hours == 0 ? 12 : hours, 2);
	},

	// H	24-hour format of an hour with leading zeros	00 through 23
	H : d => formatI(d.getHours(), 2),

	// i	Minutes with leading zeros	00 to 59
	i : d => formatI(d.getMinutes(), 2),

	// s	Seconds, with leading zeros	00 through 59
	s : d => formatI(d.getSeconds(), 2),

	// u	Microseconds (added in PHP 5.2.2). Note that date() will always generate 000000 since it takes an integer parameter, whereas DateTime::format() does support microseconds if DateTime was created with microseconds.	Example: 654321
	u : d => formatI(d.getMilliseconds(), 3) + '000',

	// v	Milliseconds (added in PHP 7.0.0). Same note applies as for u.	Example: 654
	v : d => formatI(d.getMilliseconds(), 3),

	// Timezone	---	---
	// e	Timezone identifier (added in PHP 5.1.0)	Examples: UTC, GMT, Atlantic/Azores

	// I (capital i)	Whether or not the date is in daylight saving time	1 if Daylight Saving Time, 0 otherwise.

	// O	Difference to Greenwich time (GMT) in hours	Example: +0200
	O : d => {
		let o = getGMTOffset(d);
		return `${o.sign}${o.H}${o.i}`;
	},

	// P	Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)	Example: +02:00
	P : d => {
		let o = getGMTOffset(d);
		return `${o.sign}${o.H}:${o.i}`;
	},

	// T	Timezone abbreviation	Examples: EST, MDT ...
	
	// Z	Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.	-43200 through 50400
	Z : d => d.getTimezoneOffset() * 60 + '',
	
	// Full Date/Time	---	---
	// c	ISO 8601 date (added in PHP 5)	2004-02-12T15:19:21+00:00
	c : d => date_format(d, 'Y-m-d\\TH:i:sP'),

	// r	» RFC 2822 formatted date	Example: Thu, 21 Dec 2000 16:01:07 +0200
	r : d => date_format(d, 'D, d M Y H:i:s O'),

	// U	Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)	See also time()
	U : d => parseInt(d.getTime() / 1000) + '',
};

const format = (d, char) => {
	let fn = FORMATTER[char];
	if (typeof fn == 'string') {
		return format(d, fn);
	}
	else if (fn) {
		return fn(d);
	}
	else {
		return char;
	}
};

function date_format(date, mask) {
	let escaped = false, cursor = 0;
	let output = '';
	for (let cursor = 0; cursor < mask.length; cursor++) {
		let char = mask[cursor];
		if (escaped) {
			output += char;
			escaped = false;
		}
		else if (char == ESCAPE_CHAR) {
			escaped = true;
		}
		else {
			output += format(date, char);
		}
	}
	return output;
}

module.exports = date_format;