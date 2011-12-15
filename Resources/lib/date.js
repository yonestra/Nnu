function computeDate(year, month, day, addDays) {
    var dt = new Date(year, month - 1, day);
    var baseSec = dt.getTime();
    var addSec = addDays * 86400000;//日数 * 1日のミリ秒数
    var targetSec = baseSec + addSec;
    dt.setTime(targetSec);
    return dt;
}
function compareDate(year1, month1, day1, year2, month2, day2) {
    var dt1 = new Date(year1, month1 - 1, day1);
    var dt2 = new Date(year2, month2 - 1, day2);
    var diff = dt1 - dt2;
    var diffDay = diff / 86400000;//1日は86400000ミリ秒
    return diffDay;
}