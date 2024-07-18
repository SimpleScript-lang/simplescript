
'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */
    ;

function isLeapYear(date) {
    let year = date.getFullYear();
    return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}

module.exports = isLeapYear;