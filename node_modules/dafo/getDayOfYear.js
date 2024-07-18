
/**
 * Get the day of the year (1...366).
 * @param  {Date} d
 */
function getDayOfYear(d) {
    let firstDayOfYear = new Date(d);
    firstDayOfYear.setMonth(0);
    firstDayOfYear.setDate(0);

    let days = (d.getTime() - firstDayOfYear.getTime()) / 1000 / 86400;
    return days;
}

module.exports = getDayOfYear;