
/**
 * Number of days of the month given date belonging to, 28 .. 31.
 * @param  {Date} d
 */
function getMonthDays(d) {
    let lastDay = new Date(d);
    lastDay.setMonth(d.getMonth() + 1);
    lastDay.setDate(0);
    return lastDay.getDate();
}

module.exports = getMonthDays;