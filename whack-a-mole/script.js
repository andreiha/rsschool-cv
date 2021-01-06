const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const startButton = document.getElementById('start__button');
const speedButtons = document.querySelectorAll('.speed__button');
const slowerButton = document.getElementById('slower__button');
const fasterButton = document.getElementById('faster__button');
const currentSpeed = document.getElementById('current-speed');


let lastHole;
let timeUp = false;
let score = 0;
let basicSpeed = 0;
let minspeed = 300;
let maxspeed = 1000;


function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
      return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(minspeed, maxspeed);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if(!timeUp) peep();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    peep();
    setTimeout(() => timeUp = true, 10000);
}

function bonk(e) {
    score++;
    this.classList.remove('up');
    scoreBoard.textContent = score;
}

function changeSpeedSetting (e) {
    if (e.target === fasterButton) {
        basicSpeed++;
    }
    if (e.target === slowerButton) {
        basicSpeed--;
    }
    basicSpeed === 2 ? fasterButton.disabled = true : fasterButton.disabled = false;
    basicSpeed === -2 ? slowerButton.disabled = true : slowerButton.disabled = false;
    console.log(basicSpeed);
    changeSpeed();
}

function changeSpeed() {
    if (basicSpeed === 2) {
        minspeed = 200;
        maxspeed = 400;
    }
    if (basicSpeed === 1) {
        minspeed = 200;
        maxspeed = 600;
    }
    if (basicSpeed === 0) {
        minspeed = 300;
        maxspeed = 900;
    }
    if (basicSpeed === -1) {
        minspeed = 450;
        maxspeed = 1200;
    }
    if (basicSpeed === -2) {
        minspeed = 800;
        maxspeed = 1500;
    }
    console.log(minspeed, maxspeed);
}

moles.forEach(mole => mole.addEventListener('click', bonk));
startButton.addEventListener('click', startGame);
speedButtons.forEach(button => button.addEventListener('click', changeSpeedSetting));
