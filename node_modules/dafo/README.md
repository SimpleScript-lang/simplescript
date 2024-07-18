#	dafo
__General Date Format__

[![total downloads of dafo](https://img.shields.io/npm/dt/dafo.svg)](https://www.npmjs.com/package/dafo)
[![dafo's License](https://img.shields.io/npm/l/dafo.svg)](https://www.npmjs.com/package/dafo)
[![latest version of dafo](https://img.shields.io/npm/v/dafo.svg)](https://www.npmjs.com/package/dafo)
[![build status of github.com/YounGoat/ecmascript.dafo](https://travis-ci.org/YounGoat/ecmascript.dafo.svg?branch=master)](https://travis-ci.org/YounGoat/ecmascript.dafo)

##	Description

To format date in [PHP](#dafophp) or [MySQL](#dafomysql) style.

##	Table of Contents

*	[DISCLAIMER](#disclaimer)
*	[Get Started](#get-started)
*	[API](#api)
	*	[dafo/mysql](#dafomysql)
	*	[dafo/php](#dafophp)
	*	[dafo.parse](#dafoparse)
	*	[Others](#others)
*	[Why dafo](#why-dafo)
*	[About](#about)
*	[References](#references)
*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/ecmascript.dafo)

##	DISCLAIMER

I understand that date and datetime is really important and sensitive. However, there are too many details to be dealt with in this package. So, there is __NO guarantee__ that the outputs of __dafo__ will conform to what described in this document.

If anything unexpected found, please create an issue to let me and others know.

##	Get Started

__dafo__ offers different ways to format a date. And you may choose the style which you are familiar with.

###	MySQL Style

```javascript
const DATE_FORMAT = require('dafo/mysql');

// Use customised format mask.
DATE_FORMAT(new Date, '%Y-%M-%d');
// e.g. RETURN 2018-1-1

// Use predefined format mask.
DATE_FORMAT(new Date, DATE_FORMAT.USA);
```

See MySQL Reference Manual [Date and Time Functions, DATE_FORMAT](https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_date-format) for details, and [GET_FORMAT](https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_get-format) for available predefined formats.

###	PHP Style

```javascript
const date_format = require('dafo/php');

date_format(new Date, 'Y-n-j');
// e.g. RETURN 2018-1-1
```

See PHP Manual > [Date/Time Functions](http://php.net/manual/function.date.php) for details.

##	API

###	dafo/mysql

```javascript
const date_format = require('dafo/mysql');
```
*	string __date_format__(Date *date*, string *format*)
*	const string __date_format.DATE.*__
*	const string __date_format.DATETIME.*__
*	const string __date_format.TIME.*__

Special characters prefixed with `%` will be recognized and transformed into corresponding date text. Characters prefixed with `%` but unrecognizable will be preserved wite the leading `%` trimmed.

Follow the next table for frequently used format characters which supported by __dafo/mysql__:

| Catergory  | Example           | Ch     | Meaning                                     |
| :--------- | :---------------- | :----- | :------------------------------------------ |
| Day        | Sun..Sat          | __%a__ | weekday short name |
| Day        | 1st,2nd..31st     | __%D__ | day of the month (ordinal number) |
| Day        | 01..31            | __%d__ | day of the month |
| Day        | 1..31             | __%e__ | day of the month |
| Day        | 001..366          | __%j__ | day of the year |
| Day        | Sunday..Saturday  | __%W__ | weekday name |
| Day        | 0..6              | __%w__ | weekday number (0=Sunday..6=Saturday) |
| Week       | 00..53            | __%U__ | week number of year (mode 0) |
| Week       | 00..53            | __%u__ | week number of year (mode 1) |
| Week       | 01..53            | __%V__ | week number of year (mode 2) |
| Week       | 01..53            | __%v__ | week number of year (mode 3) |
| Month      | Jan..Dec          | __%b__ | month short name |
| Month      | 1..12             | __%c__ | month number |
| Month      | January..December | __%M__ | month name |
| Month      | 01..12            | __%m__ | month number |
| Year       | 1999              | __%X__ | week-numbering year (mode 2) |
| Year       | 1999              | __%x__ | week-numbering year (mode 3) |
| Year       | 2000              | __%Y__ | year |
| Year       | 00                | __%y__ | year |
| Time       | 000000..999999    | __%f__ | micro-seconds |
| Time       | 00..23            | __%H__ | hours (24-hour) |
| Time       | 01..12            | __%h__ | hours (12-hour) |
| Time       | 01..12            | __%I__ | hours (12-hour) |
| Time       | 00..59            | __%i__ | minutes |
| Time       | 0..23             | __%k__ | hours (24-hour) |
| Time       | 1..12             | __%l__ | hours (12-hour) |
| Time       | AM, PM            | __%p__ | Ante meridiem / Post meridiem |
| Time       | 11:59:59 AM       | __%r__ | time (12-hour) |
| Time       | 00..59            | __%S__ | seconds |
| Time       | 00..59            | __%s__ | seconds |
| Time       | 23:59:59          | __%T__ | time (24-hour) |

ATTENTION: Most, but __NOT ALL__ format characters used in MySQL function `DATE_FORMAT()` are supported by __dafo/mysql__.

###	dafo/php

```javascript
const date_format = require('dafo/php');
```
*	string __date_format__(Date *date*, string *format*)

As what `date()` in PHP does, __dafo/php__ will recognize special single characters in format string and transform them into corresponding date text. Unlike __dafo/mysql__, there are no leading escapers before these special characters and those not recognized will be preserved. 

__Escape Character__  
If you want to keep the format character from being replaced, prefix it with an escape character anti-slash `\`, e.g. 
```javascript
date_format(new Date(2000, 0, 1), '\\Y Y');
// RETURN 'Y 2000'

// Because '\' is also the default escaper in JavaScript string, 
// you should input double anti-slash characters '\\' in string literal 
// to create a real '\' in the format.
```

Follow the next table for frequently used format characters which supported by __dafo/php__:

| Catergory  | Example           | Ch    | Meaning                                     |
| :--------- | :---------------- | :---- | :------------------------------------------ |
| Day        | 01..31            | __d__ | day of the month |
| Day        | Mon..Sun          | __D__ | weekday short name |
| Day        | 1..31             | __j__ | day of the month |
| Day        | Sunday..Saturday  | __l__ | weekday name |
| Day        | 1..7              | __N__ | weekday number |
| Day        | st,nd..st         | __S__ | day of the month (ordinal suffix) |1
| Day        | 0..6              | __w__ | weekday number |
| Day        | 0..365            | __z__ | day of the year |
| Week       | 01..53            | __W__ | week number of year |
| Month      | January..December | __F__ | month name |
| Month      | 01..12            | __m__ | month number |
| Month      | Jan..Dec          | __M__ | month short name |
| Month      | 1..12             | __n__ | month number |
| Month      | 28..31            | __t__ | days in the month |
| Year       | 0,1               | __L__ | if it is a leap year |
| Year       | 1999, 2000        | __o__ | week-numbering year |
| Year       | 0100, 1899, 2050  | __Y__ | year A.D. |
| Year       | 00, 99, 50        | __y__ | year A.D. |
| Time       | am, pm            | __a__ | Ante meridiem / Post meridiem |
| Time       | AM, PM            | __A__ | Ante meridiem / Post meridiem |
| Time       | 1..12             | __g__ | 12 hour |
| Time       | 0..23             | __G__ | 24 hour |
| Time       | 01..12            | __h__ | 12 hour |
| Time       | 00..23            | __H__ | 24 hour |
| Time       | 00..59            | __i__ | minutes |
| Time       | 00..59            | __s__ | seconds |
| Time       | 000000..999999    | __u__ | micro-seconds |
| Time       | 000...999         | __v__ | milli-seconds |
| TimeZone   | +0800             | __O__ | offset from GMT (in hours and minutes) |
| TimeZone   | +08:00            | __P__ | offset from GMT (in hours and minutes) |
| TimeZone   | 28800             | __Z__ | offset from GMT (in seconds) |

ATTENTION: Most, but __NOT ALL__ format characters used in PHP function `date()` are supported by __dafo/php__.

###	dafo.parse

```javascript
const dafo = require('dafo');

// Get a Date object.
let date = dafo.parse('2019.04.01', 'Y.m.d');
```

*	Date __dafo.parse__(string *date*, string *format*)

Argument *format* describes what and how makes up *date* string. Acceptable placeholders include:  
( Other characters are regarded as normal text. )

| Catergory  | Example           | Ch    | Meaning                                     |
| :--------- | :---------------- | :---- | :------------------------------------------ |
| Day        | 01..31            | __d__ | day of the month |
| Month      | 01..12            | __m__ | month number |
| Year       | 0100, 1899, 2050  | __Y__ | year A.D. |
| Time       | 00..23            | __H__ | 24 hour |
| Time       | 00..59            | __i__ | minutes |
| Time       | 00..59            | __s__ | seconds |

###	Others

*	number __dafo.getDayOfYear__(Date *date*)  
	Get the day of the current year.  
	Jan 1st is always 1, and Dec 31st may be 365 (not leap year) or 366 (leap year).

*	number __dafo.getMonthDays__(Date *date*)  
	Get days of the current month.  

*	number __dafo.getWeekOfYear__(Date *date*, number *mode*)  
	Get the week number of year.  
	Read section [Week Mode](#week-mode) for details about the *mode* argument.

*	{ Date *first*, Date *last* } __dafo.getWeekRange__({ number *year*, number *week*, number *mode* })  
	Get the week range.  
	Read section [Week Mode](#week-mode) for details about the *mode* argument.
	
*	{ *year*, *week* } __dafo.getYearWeek__(Date *date*, number *mode*)  
	Get the week number of year, and the corresponding year.  
	In some *mode*, the first few days in a year may be belonging to the last week of last year.   
	Read section [Week Mode](#week-mode) for details about the *mode* argument.

*	boolean __dafo.isLeapYear__(Date *date*)  
	Return `true` if the year of *date* is leap. Otherwise return `false`.

*	Date __dafo.parse__(string *date*, string *format*)

###	Week Mode

The definition of *mode* argument in functions `dafo.getWeekOfYear()` and `dafo.getYearWeek()` is borrowed from [MySQL function `WEEK()`](https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_week). The next table is cited from MySQL Manual and explains the difference between modes: 

| Mode  | 1st weekday | Range | Week 1 is the first week ...  | Follows |
| :---  | :---------- | :---- | :---------------------------- | :------ |
| __0__ | Sunday      | 0-53  | with a Sunday in this year    |
| __1__ | Monday      | 0-53  | with 4 or more days this year |
| __2__ | Sunday      | 1-53  | with a Sunday in this year    |
| __3__ | Monday      | 1-53  | with 4 or more days this year | ISO 8601 |
| __4__ | Sunday      | 0-53  | with 4 or more days this year |
| __5__ | Monday      | 0-53  | with a Monday in this year    |
| __6__ | Sunday      | 1-53  | with 4 or more days this year |
| __7__ | Monday      | 1-53  | with a Monday in this year    |


##  Why *dafo*

There have been lots of packages helping to format date or datetime. Generally, a format string is required to indicate what kind of date string you want, e.g. *YY* in __moment__ means *2 digit year*. The formats used in those packages are similiar, but more or less different from each other. It is really confusing! For those who are familiar with syntax used in `date()` in PHP or `DATE_FORMAT()` in MySQL, it is wasting time to learn another one. 

I am tired of inventing something new but useless. What uou will not meet with in __dafo__ is NOT a new *general* format, but something you have been familiar with.

##  About

##  References

*	MySQL 5.7 Reference Manual > [Date and Time Functions](https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_date-format)
*	PHP Manual > [Date/Time Functions](http://php.net/manual/en/function.date.php)
*	[Date and time format - ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) or WIKIPEDIA: [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)	