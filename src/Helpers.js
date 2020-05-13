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

export function generateSnapValues(step, topOffset, clientHeight) {
    var snap = [0]
    var current = topOffset;
    while(current < topOffset + clientHeight) {
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