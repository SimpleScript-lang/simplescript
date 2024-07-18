
'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */
    , getWeek1Offset = require('./lib/getWeek1Offset')
    , getDayOfYear = require('./getDayOfYear')
    ;

/**
 * Get the week of the year, 0..53 in default mode 0.
 * @param {Date}     d
 * @param {number}  [mode=0]
 * 
 * -- READMORE --
 * https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_week
 *     The following table describes how the mode argument works.
 *     Mode	First day of week	Range	Week 1 is the first week …
 *     0	Sunday	0-53	with a Sunday in this year
 *     1	Monday	0-53	with 4 or more days this year
 *     2	Sunday	1-53	with a Sunday in this year
 *     3	Monday	1-53	with 4 or more days this year
 *     4	Sunday	0-53	with 4 or more days this year
 *     5	Monday	0-53	with a Monday in this year
 *     6	Sunday	1-53	with 4 or more days this year
 *     7	Monday	1-53	with a Monday in this year
 * 
 */
function getYearWeek(d, mode = 0) {
    let year = d.getFullYear();
    let week1Offset = getWeek1Offset(year, mode);
    let daysOfYear = getDayOfYear(d);

    // In these modes, dates before week 1 belong to the last week of last year.
    if (daysOfYear <= week1Offset && [2,3,6,7].includes(mode)) {
        let Dec31st = new Date(year - 1, 11, 31);
        return getYearWeek(Dec31st, mode);
    }
    else {
        let week = Math.ceil((daysOfYear - week1Offset) /  7);
        if (week == 0) week = 0; // Avoid -0.
        return { year, week };
    }
}

module.exports = getYearWeek;