const song = document.querySelector('.song'),
    play = document.querySelector('.play'),
    outline = document.querySelector('.moving-outline circle'),
    video = document.querySelector('.vid-container video'),
    sounds = document.querySelectorAll('.sound-picker button'),
    timeDisplay = document.querySelector('.time-display'),
    timeSelect = document.querySelectorAll('.time-select button'),
    outlineLength= outline.getTotalLength();

let duration = 600;

outline.style.strokeDasharray = outlineLength;
outline.style.strokeDashoffset = outlineLength;

//Play and stop function
const checkPlaying = song => {
    if (song.paused) {
        song.play();
        video.play();
        play.src = 'svg/pause.svg';
    } else {
        song.pause();
        video.pause();
        play.src = 'svg/play.svg';
    }
}

//Listener for play button
play.addEventListener('click', function() {
    checkPlaying(song);
})

//Select different sound and video
sounds.forEach(sound => {
    sound.addEventListener('click', function() {
        song.src = this.getAttribute('data-sound');
        video.src = this.getAttribute('data-video');
        checkPlaying(song);
    })
})

//Select timing
timeSelect.forEach(option => {
    option.addEventListener('click', function() {
        duration = this.getAttribute('data-time');
        if (song.paused) {
            timeDisplay.textContent = `${Math.floor(duration / 60)}:${addZero(Math.floor(duration % 60))}`;
        }
    })
})

//Add zero to minutes
function addZero (n) {
    return (n < 10 ? '0' : '') + n;
}

//Circle animation
song.ontimeupdate = () => {
    let currentTime = song.currentTime;
    let elapsed = duration - currentTime;
    let seconds = Math.floor(elapsed % 60);
    let minutes = Math.floor(elapsed / 60);

    let progress = outlineLength - (currentTime / duration) * outlineLength;
    outline.style.strokeDashoffset = progress;

    if (currentTime >= duration) {
        song.pause();
        song.currentTime = 0;
        play.src = "svg/play.svg";
        video.pause();
    }

    timeDisplay.textContent = `${minutes}:${addZero(seconds)}`;
}
