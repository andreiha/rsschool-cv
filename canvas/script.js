let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let colorCheckbox = document.getElementById('color_checkbox');
let colorPicker = document.getElementById('color_picker');
let widthCheckbox = document.getElementById('width_checkbox');
let widthPicker = document.getElementById('width_picker');
let clearButton = document.getElementById('clear_button');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let color = 0;
let direction = true;

canvas.width = document.documentElement.clientWidth;
canvas.height = `${document.documentElement.clientHeight}`;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 30;

function draw(e) {
    if (!isDrawing) return;
    chooseColor();
    chooseWidth();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
}

function chooseColor() {
    if (!colorCheckbox.checked) {
        ctx.strokeStyle = colorPicker.value;
    } else {
        ctx.strokeStyle = `hsl(${color}, 100%, 50%)`;
        color++;
        if (color >= 360) {
        color = 0;
        }
    }
}

function chooseWidth() {
    if (!widthCheckbox.checked) {
        ctx.lineWidth = widthPicker.value;
    } else {
        if (ctx.lineWidth >= 100 || ctx.lineWidth <=1) {
            direction = !direction;
        }
        if (direction) {
            ctx.lineWidth++;
        } else {
            ctx.lineWidth--;
        }
    }
}

function enableWidthPicker() {
    if (widthCheckbox.checked) {
        widthPicker.disabled = true;
    } else {
        widthPicker.disabled = false;
    } 
}

function enableColorPicker() {
    if (colorCheckbox.checked) {
        colorPicker.disabled = true;
    } else {
        colorPicker.disabled = false;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);
colorCheckbox.addEventListener('click', enableColorPicker);
widthCheckbox.addEventListener('click', enableWidthPicker);
clearButton.addEventListener('click', clearCanvas);
