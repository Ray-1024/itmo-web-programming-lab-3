/*
let form = document.getElementById("xyrForm");
let submitButton = document.getElementById("submitButton");
let canvas = document.getElementById("plot");
let context = canvas.getContext("2d");
let errorBlock = document.getElementById("errorBlock");
//   Data
let sizes = {w: canvas.clientWidth, h: canvas.clientHeight, inactivePoint: 5.0, activePoint: 10.0};
let center = {x: canvas.clientWidth / 2.0, y: canvas.clientHeight / 2.0};
let units = {x: 25.0, y: 25.0};
let colors = {
    clearColor: "#FDF4E3",
    areaFillColor: "blue",
    gridColor: "gray",
    gridAxisColor: "black",
    inactivePoint: "gray",
    activePoint: "red"
};
let inactivePoints = [];
let maxInactivePointsCount = 10;
let activePoint = undefined;
let lastValuesOfFields = {
    x: undefined, y: undefined, r: undefined
};
let errorRIsNotSet = "R не указан или не соответствует требованиям";

//   Utils
function windowToCanvas(x, y) {
    let boundingClientRect = canvas.getBoundingClientRect();
    return {
        x: x - boundingClientRect.left * (canvas.width / boundingClientRect.width),
        y: y - boundingClientRect.top * (canvas.height / boundingClientRect.height)
    };
}

function windowToCoords(x, y) {
    let coords = windowToCanvas(x, y);
    return {x: (coords.x - center.x) / units.x, y: (center.y - coords.y) / units.y};
}

function coordsToCanvas(_x, _y) {
    return {
        x: center.x + _x * units.x, y: center.y - _y * units.y
    }
}

function toNumber(value) {
    value = value.toString().replace(",", ".").trim();
    let val = parseFloat(value);
    return (isFinite(val) && isFinite(value)) ? val : NaN;
}

function isXValid() {
    for (let item of xRadio) if (item.checked) {
        if (!["-2.0", "-1.5", "-1.0", "-0.5", "0.0", "0.5", "1.0", "1.5", "2.0"].includes(item.value)) return false;
    }
    return true;
}

function isYValid() {
    let y = toNumber(yText.value);
    return (!isNaN(y) && y > -3.0 && y < 5.0) ? y : NaN;
}

function isRValid() {
    let r = toNumber(rText.value);
    return (!isNaN(r) && r > 2.0 && r < 5.0) ? r : NaN;
}

function isFormValid() {
    return isXValid() && isYValid() && isRValid();
}

function updateSubmitButton() {
    submitButton.disabled = !isFormValid();
}

function showErrorMessage(message) {
    errorBlock.innerText = message;
    errorBlock.hidden = false;
}

function hideErrorMessage() {
    errorBlock.hidden = true;
}

function evalActivePoint(e) {
    activePoint = windowToCanvas(e.clientX, e.clientY);
    let coords = windowToCoords(e.clientX, e.clientY);
    xRadio.item(0).value = coords.x.toString();
    yText.value = coords.y.toString();
}

function storeFields() {
    for (let curr of xRadio) if (curr.checked) {
        lastValuesOfFields.x = curr;
        curr.checked = false;
        break;
    }
    lastValuesOfFields.y = yText.value;
    lastValuesOfFields.r = rText.value;
    xRadio.item(0).checked = true;
}

function restoreFields() {
    activePoint = undefined;
    xRadio.item(0).checked = false;
    if (lastValuesOfFields.x) lastValuesOfFields.x.checked = true;
    yText.value = lastValuesOfFields.y;
    rText.value = lastValuesOfFields.r;
}

function fillInactivePointsFromStory() {
    let resultX = document.getElementsByName("resultX");
    let resultY = document.getElementsByName("resultY");
    for (let i = 0; i < resultX.length; ++i) inactivePoints.push(coordsToCanvas(toNumber(resultX.item(i).innerText), toNumber(resultY.item(i).innerText)));
}

//   DRAWING
function clear() {
    context.fillStyle = colors.clearColor;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawArea() {
    let rValue = isRValid();
    if (isNaN(rValue)) return;
    context.fillStyle = colors.areaFillColor;
    context.beginPath();
    context.moveTo(center.x + units.x * (-rValue), center.y);
    context.lineTo(center.x, center.y + units.y * (rValue / 2.0));
    context.lineTo(center.x, center.y + units.y * (-rValue));
    context.lineTo(center.x + units.x * (-rValue), center.y + units.y * (-rValue));
    context.fill();
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.arc(center.x, center.y, units.x * (rValue / 2.0), 0.0, Math.PI / 2.0, false);
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

function drawInactivePoints() {
    if (inactivePoints.empty) return;
    while (inactivePoints.length > maxInactivePointsCount) inactivePoints.shift();
    context.fillStyle = colors.inactivePoint;
    for (let item of inactivePoints) {
        context.beginPath();
        context.arc(item.x, item.y, sizes.inactivePoint, 0, 2 * Math.PI);
        context.fill();
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
    drawInactivePoints();
    drawActivePoint();
}

function update() {
    updateSubmitButton();
    draw();
}

//   Callbacks
canvas.onmouseenter = (e) => {
    storeFields();
    evalActivePoint(e);
    update();
}
canvas.onmousemove = (e) => {
    evalActivePoint(e);
    update();
}
canvas.onmouseleave = (e) => {
    restoreFields();
    hideErrorMessage();
    update();
}
canvas.onmouseup = (e) => {
    if (!isNaN(isRValid())) form.submit(); else showErrorMessage(errorRIsNotSet);
}
yText.oninput = update;
rText.oninput = update;
window.onload = (e) => {
    fillInactivePointsFromStory();
    update();
};
*/
