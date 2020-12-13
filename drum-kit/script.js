function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    let key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    key.classList.add('playing');
}

function removeBorder(e) {
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    key.classList.remove('playing');
}

window.addEventListener('keydown', playSound);
window.addEventListener('keyup', removeBorder);