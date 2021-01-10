const speed = document.querySelector('.speed');
const bar = document.querySelector('.speed-bar');
const video = document.querySelector('.screen');

function handleMove(e) {
    const y = e.pageY - this.offsetTop;
    const percent = y / this.offsetHeight;
    console.log(bar.innerHTML);
    const min = 0.4;
    const max = 4;
    const height = Math.round(percent * 100) + '%';
    const playbackRate = percent * (max - min) + min;
    bar.style.height = height;
    bar.innerHTML = playbackRate.toFixed(2)+ 'x';
    video.playbackRate = playbackRate;
}

speed.addEventListener('mousemove', handleMove);
