export function generateColumnSizes(n) {
    var percent = 100 / (n);
    var percentArray = Array(n);
    percentArray.fill(`${percent}%`)
    return { display: "grid", gridTemplateColumns: percentArray.join(" ") }
}

export function generateRowSizes(n) {
    var percent = 100 / (n);
    var percentArray = Array(n);
    percentArray.fill(`${percent}%`)
    return { display: "grid", gridTemplateRows: percentArray.join(" ") }
}

export function snap(values, top) {
    var closest = values.reduce(function (prev, curr) {
        return (Math.abs(curr - top) < Math.abs(prev - top) ? curr : prev);
    });
    return closest
}

export function generateSnapValues(step, topOffset, clientHeight) {
    var snap = [-1]
    var current = 0;
    while(current < topOffset + clientHeight) {
        snap.push(current);
        current += step;
    }
    snap.push(topOffset + clientHeight + snap)
    return snap;
}

export function topToTime(startTime, endTime, percent, column, startDate) {
    var deltaTime = (endTime - startTime) * percent;
    var newTime = new Date();
    newTime.setHours(startTime + deltaTime)
    newTime.setDate(startDate + column)
    return newTime;
}


export function generateGridCSS(days, hours) {
    var css = []
    for(var row = 0; row < hours; row++) {
        var rowString = "\"";
        for(var column = 0; column < days; column++){
            if (row === 0) {
                rowString += (column === 0)?"none ":"header "
            } else {
                rowString += (column === 0)?"date ": "grid "
            }
        }
        rowString = rowString.trim() + "\""
        css.push(rowString)
    }
    return css.join(" ")
}