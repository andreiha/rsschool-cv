const app = () => {
    const song = document.querySelector('.song'),
        play = document.querySelector('.play'),
        outline = document.querySelector('.moving-outline circle'),
        video = document.querySelector('.vid-container video'),
        sounds = document.querySelectorAll('.sound-picker button'),
        timeDisplay = document.querySelector('.time-display'),
        timeSelect = document.querySelectorAll('.time-select button'),
        outlineLength= outline.getTotalLength();

    let fakeDuration = 600;

    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = outlineLength;

    //pick different sounds
    sounds.forEach(sound => {
        sound.addEventListener('click', function() {
            song.src = this.getAttribute('data-sound');
            video.src = this.getAttribute('video-sound');
            checkPlaying(song);
        })
    })

    //play sound
    play.addEventListener('click', function() {
        checkPlaying(song);
    })

    //Select sound 
    timeSelect.forEach(option => {
        option.addEventListener('click', function() {
            fakeDuration = this.getAttribute('data-time');
            timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`;
        })
    })

    //Stop and play the sounds
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

    //Circle animation
    song.ontimeupdate = () => {
        let currentTime = song.currentTime;
        let elapsed = fakeDuration - currentTime;
        let seconds = Math.floor(elapsed % 60);
        let minutes = Math.floor(elapsed / 60);

        //Animation the circle
        let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
        outline.style.strokeDashoffset = progress;

        if (currentTime >= fakeDuration) {
            song.pause();
            song.currentTime = 0;
            play.src = "svg/play.svg";
            video.pause();
        }

        //Animate the text
        timeDisplay.textContent = `${minutes}:${seconds}`;
    }
};

app();