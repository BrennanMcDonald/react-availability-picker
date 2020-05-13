export function generateRowSizes(n) {
    var percent = 100 / (n + 1);
    var percentArray = Array(n + 1);
    percentArray.fill(`${percent}%`)
    return { display: "grid", gridTemplateColumns: percentArray.join(" ") }
}

export function snap(values, top) {
    var closest = values.reduce(function (prev, curr) {
        return (Math.abs(curr - top) < Math.abs(prev - top) ? curr : prev);
    });
    return closest
}

export function generateSnapValues(step) {
    var snap = [0]
    var start = document.getElementById("DatePickerContent").offsetTop;
    var current = start;
    while(current < document.getElementById("DatePickerContent").offsetTop + document.getElementById("DatePickerContent").clientHeight) {
        snap.push(current);
        current += step;
    }
    return snap;
}

export function topToTime(startTime, endTime, top, total, column) {
    var percent = top/total;
    var deltaTime = (endTime.getTime() - startTime.getTime()) * percent;
    var newTime = new Date((new Date(startTime)).getTime() + deltaTime);
    newTime.setDate(startTime.getDate() + column)
    return newTime;
}
