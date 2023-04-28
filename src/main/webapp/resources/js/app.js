let canvas, context, sizes, center, x, y, r;
let units = {x: 25.0, y: 25.0};
let colors = {
    clearColor: "#FDF4E3",
    areaFillColor: "#A4854A",
    gridColor: "gray",
    gridAxisColor: "black",
    activePoint: "gray",
    successPoint: "green",
    failPoint: "red"
};
let activePoint = undefined;

function toNumber(value) {
    if (!value) return false;
    value = value.value.toString().replace(",", ".").trim();
    let val = parseFloat(value);
    return (isFinite(val) && isFinite(value)) ? val : NaN;
}

function getX() {
    return document.getElementById("xyrForm:hiddenX");
}

function getY() {
    return document.getElementById("xyrForm:y");
}

function getR() {
    return document.getElementById("xyrForm:hiddenR");
}

function validateX() {
    let xVal = toNumber(getX());
    return !isNaN(xVal) && xVal >= -3.0 && xVal <= 5.0;
}

function validateY() {
    let yVal = toNumber(getY());
    return !isNaN(yVal) && yVal > -3.0 && yVal < 5.0;
}

function validateR() {
    let rVal = toNumber(getR());
    return !isNaN(rVal) && rVal >= 1.0 && rVal <= 3.0;
}

function validateForm() {
    hideErrorMessage();
    if (!validateR()) {
        showErrorMessage("Радиус не задал или не удовлетворяет ограничениям");
        return false;
    }
    if (!validateX()) {
        showErrorMessage("X-координата не указана или не соответсвует допустимым значениям");
        return false;
    }
    if (!validateY()) {
        showErrorMessage("Y-координата не указана или не соответсвует допустимым значениям");
        return false;
    }
    hideErrorMessage();
    return true;
}

function windowToCanvas(x, y) {
    let boundingClientRect = canvas.getBoundingClientRect();
    return {
        x: x - boundingClientRect.left * (canvas.width / boundingClientRect.width),
        y: y - boundingClientRect.top * (canvas.height / boundingClientRect.height)
    };
}

function windowToCoords(x, y) {
    let coords = windowToCanvas(x, y);
    return {x: ((coords.x - center.x) / units.x).toFixed(2), y: ((center.y - coords.y) / units.y).toFixed(2)};
}

function coordsToCanvas(_x, _y) {
    return {
        x: center.x + _x * units.x, y: center.y - _y * units.y
    }
}

function showErrorMessage(message) {
    document.getElementById("errorBlock").innerHTML += "<div class='framedBlock'>" + message + "</div>";
    document.getElementById("errorBlock").hidden = false;
}

function hideErrorMessage() {
    document.getElementById("errorBlock").hidden = true;
    document.getElementById("errorBlock").innerHTML = "";
}

function clear() {
    context.fillStyle = colors.clearColor;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawArea() {
    let rValue = toNumber(getR());
    if (isNaN(rValue)) return;
    context.fillStyle = colors.areaFillColor;

    context.beginPath();
    context.moveTo(center.x, center.y - units.y * (rValue / 2.0));
    context.lineTo(center.x + units.x * (-rValue), center.y);
    context.lineTo(center.x, center.y);
    context.fill();

    context.beginPath();
    context.moveTo(center.x, center.y);
    context.arc(center.x, center.y, units.x * rValue, Math.PI / 2.0, Math.PI, false);
    context.fill();

    context.beginPath();
    context.moveTo(center.x, center.y);
    context.lineTo(center.x, center.y + units.y * (rValue / 2.0));
    context.lineTo(center.x + units.x * (rValue), center.y + units.y * (rValue / 2.0));
    context.lineTo(center.x + units.x * (rValue), center.y);
    context.fill();
}

function drawGrid() {
    context.fillStyle = colors.gridColor;
    for (let x = units.x; x <= sizes.w; x += units.x) context.fillRect(x, 0, 1, sizes.h);
    for (let y = units.y; y <= sizes.h; y += units.y) context.fillRect(0, y, sizes.w, 1);
    context.fillStyle = colors.gridAxisColor;
    context.fillRect(center.x - 1, 0, 2, sizes.h);
    context.fillRect(0, center.y - 1, sizes.w, 2);
}

function drawPoint(x, y, result) {
    context.fillStyle = ((result === "Success") ? colors.successPoint : colors.failPoint);
    context.beginPath();
    context.moveTo(x, y);
    context.arc(x, y, sizes.inactivePoint, 0, 2 * Math.PI);
    context.fill();
}

function drawHistory() {
    let xValues = document.getElementsByName("xColumn");
    let yValues = document.getElementsByName("yColumn");
    let resultValues = document.getElementsByName("resultColumn");
    for (let i = 0; i < xValues.length; ++i) {
        let coords = coordsToCanvas(parseFloat(xValues[i].innerText), parseFloat(yValues[i].innerText));
        drawPoint(coords.x, coords.y, resultValues[i].innerText);
    }
}

function drawActivePoint() {
    if (activePoint === undefined) return;
    context.fillStyle = colors.activePoint;
    context.beginPath();
    context.arc(activePoint.x, activePoint.y, sizes.activePoint, 0, 2 * Math.PI);
    context.fill();
}

function draw() {
    clear();
    drawArea();
    drawGrid();
    drawHistory();
    drawActivePoint();
}

window.onload = () => {
    canvas = document.getElementById("plot");
    context = canvas.getContext("2d");
    sizes = {w: canvas.clientWidth, h: canvas.clientHeight, inactivePoint: 5.0, activePoint: 10.0};
    center = {x: canvas.clientWidth / 2.0, y: canvas.clientHeight / 2.0};
    draw();
    hideErrorMessage();
    setInterval(() => {
        getY().value = getY().value.replace(",", ".");
        draw();
    }, 100);
    getY().onchange = () => {
        getY().value = getY().value.toString().replace(",", ".");
        validateForm();
        draw();
    };
    canvas.onmouseenter = (e) => {
        activePoint = windowToCanvas(e.clientX, e.clientY);
        let coords = windowToCoords(e.clientX, e.clientY);
        getX().value = coords.x;
        getY().value = coords.y;
        draw();
    };
    canvas.onmousemove = (e) => {
        activePoint = windowToCanvas(e.clientX, e.clientY);
        let coords = windowToCoords(e.clientX, e.clientY);
        getX().value = coords.x;
        getY().value = coords.y;
        draw();
    };
    canvas.onmouseleave = (e) => {
        hideErrorMessage();
        activePoint = undefined;
        draw();
    };
    canvas.onmouseup = (e) => {
        document.getElementById("xyrForm:submit").onclick();
        draw();
    };
};