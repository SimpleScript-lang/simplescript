/**
 * SEE
 *   MySQL 5.7 Reference Manual > 12.7 Date and Time Functions
 *   https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_date-format
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, noda = require('noda')

	/* in-package */
	, EN = noda.inRequire('EN')
	, ching_unescape = noda.inRequire('lib/ching_unescape')
	, ordinal = noda.inRequire('lib/ordinal')

	, getDayOfYear = noda.inRequire('getDayOfYear')
	, getYearWeek = noda.inRequire('getYearWeek')
	
	/* in-file */
	, formatI = (n, digits) => '0'.repeat(digits - (n+'').length) + n
	;

const ESCAPE_CHAR = '%';

const PREDEFINED_FORMATS = {
	'DATE': {
		'USA'      : '%m.%d.%Y',
		'JIS'      : '%Y-%m-%d',
		'ISO'      : '%Y-%m-%d',
		'EUR'      : '%d.%m.%Y',
		'INTERNAL' : '%Y%m%d',
	},

	'DATETIME': {
		'USA'      : '%Y-%m-%d %H.%i.%s',
		'JIS'      : '%Y-%m-%d %H:%i:%s',
		'ISO'      : '%Y-%m-%d %H:%i:%s',
		'EUR'      : '%Y-%m-%d %H.%i.%s',
		'INTERNAL' : '%Y%m%d%H%i%s',
	},
	
	'TIME': {
		'USA'      : '%h:%i:%s %p',
		'JIS'      : '%H:%i:%s',
		'ISO'      : '%H:%i:%s',
		'EUR'      : '%H.%i.%s',
		'INTERNAL' : '%H%i%s',
	},
};

const FORMATTER = {
	// %a	Abbreviated weekday name (Sun..Sat)
	a : d => EN.weekdayShortNames[ d.getDay() ],

	// %b	Abbreviated month name (Jan..Dec)
	b : d => EN.monthShortNames[ d.getMonth() ],

	// %c	Month, numeric (0..12)
	c : d => (d.getMonth() + 1) + '',

	// %D	Day of the month with English suffix (0th, 1st, 2nd, 3rd, …)
	D : d => ordinal(d.getDate()),

	// %d	Day of the month, numeric (00..31)
	d : d => formatI(d.getDate(), 2),

	// %e	Day of the month, numeric (0..31)
	e : d => d.getDate() + '',

	// %f	Microseconds (000000..999999)
	f : d => formatI(d.getMilliseconds(), 3) + '000',

	// %H	Hour (00..23)
	H : d => formatI(d.getHours(), 2),

	// %h	Hour (01..12)
	h : d => {
		let hours = d.getHours() % 12;
		return formatI(hours == 0 ? 12 : hours, 2);
	},

	// %I	Hour (01..12)
	I : 'h',

	// %i	Minutes, numeric (00..59)
	i : d => formatI(d.getMinutes(), 2),

	// %j	Day of year (001..366)
	j : d => formatI(getDayOfYear(d), 3),

	// %k	Hour (0..23)
	k : d => d.getHours() + '',

	// %l	Hour (1..12)
	l : d => {
		let hours = d.getHours() % 12;
		return (hours == 0 ? 12 : hours) + '';
	},

	// %M	Month name (January..December)
	M : d => EN.monthNames[ d.getMonth() ],

	// %m	Month, numeric (00..12)
	m : d => formatI(d.getMonth() + 1, 2),

	// %p	AM or PM
	p : d => d.getHours() < 12 ? 'AM' : 'PM',

	// %r	Time, 12-hour (hh:mm:ss followed by AM or PM)
	r : d => combine(d, 'h:i:s p'),

	// %S	Seconds (00..59)
	S : d => formatI(d.getSeconds(), 2),

	// %s	Seconds (00..59)
	s :  'S',

	// %T	Time, 24-hour (hh:mm:ss)
	T : d => combine(d, 'H:i:s'),

	// %U	Week (00..53), where Sunday is the first day of the week; WEEK() mode 0
	U : d => formatI(getYearWeek(d, 0).week, 2),

	// %u	Week (00..53), where Monday is the first day of the week; WEEK() mode 1
	u : d => formatI(getYearWeek(d, 1).week, 2),

	// %V	Week (01..53), where Sunday is the first day of the week; WEEK() mode 2; used with %X
	V : d => formatI(getYearWeek(d, 2).week, 2),

	// %v	Week (01..53), where Monday is the first day of the week; WEEK() mode 3; used with %x
	v : d => formatI(getYearWeek(d, 3).week, 2),

	// %W	Weekday name (Sunday..Saturday)
	W : d => EN.weekdayNames[ d.getDay() ],

	// %w	Day of the week (0=Sunday..6=Saturday)
	w : d => d.getDay() + '',

	// %X	Year for the week where Sunday is the first day of the week, numeric, four digits; used with %V
	X : d => formatI(getYearWeek(d, 2).year, 4),

	// %x	Year for the week, where Monday is the first day of the week, numeric, four digits; used with %v
	x : d => formatI(getYearWeek(d, 3).year, 4),
	
	// %Y	Year, numeric, four digits
	Y : d => formatI(d.getFullYear(), 4),

	// %y	Year, numeric (two digits)
	y : d => formatI(d.getFullYear(), 4).slice(-2)

	// %%	A literal % character
	// %x	x, for any “x” not listed above
	// The above 2 have been realized by ching_unescape by default.
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
		return null;
	}
};

const combine = (d, mask) => {
	let output = '';
	for (let i = 0; i < mask.length; i++) {
		const char = mask[i];
		const out = format(d, char);
		output += (out != null) ? out : char;
	}
	return output;
};

function DATE_FORMAT(date, mask) {
	return ching_unescape(mask, ESCAPE_CHAR, (mask, cursor) => {
		let char = mask[cursor];
		let output = format(date, char);
		if (output != null) {
			return { output, offset: 1 };
		}
	});
}

Object.assign(DATE_FORMAT, PREDEFINED_FORMATS);

module.exports = DATE_FORMAT;