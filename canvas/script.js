let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let color = 0;
let direction = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = '#BADA55';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 50;

function draw(e) {
    if (!isDrawing) return;
    console.log(e);
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
    ctx.strokeStyle = `hsl(${color}, 100%, 50%)`;
    color++;
    if (color >= 360) {
        color = 0;
    }
}

function chooseWidth() {
    if (ctx.lineWidth >= 100 || ctx.lineWidth <=1) {
        direction = !direction;
    }
    if (direction) {
        ctx.lineWidth++;
    } else {
        ctx.lineWidth--;
    }
}


canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);