const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const startButton = document.getElementById('start__button');
const speedButtons = document.querySelectorAll('.speed__button');
const slowerButton = document.getElementById('slower__button');
const fasterButton = document.getElementById('faster__button');
const speedBoard = document.getElementById('current-speed');
const resultBoard = document.getElementById('max-result');

let lastHole;
let timeUp = false;
let alreadyStarted = false;
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
    if (!alreadyStarted) {
        scoreBoard.textContent = 0;
        alreadyStarted = true;
        timeUp = false;
        startButton.disabled = true;
        saveRecord ();
        score = 0;
        peep();
        setTimeout(() => timeUp = true, 10000);
        setTimeout(() => (alreadyStarted = false, startButton.disabled = false), 10000);
    }
}

function bonk(e) {
    if(!e.isTrusted) return;
    score++;
    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
}

function changeSpeedSettings (e) {
    if (e.target === fasterButton) {
        basicSpeed++;
    }
    if (e.target === slowerButton) {
        basicSpeed--;
    }
    basicSpeed === 2 ? fasterButton.disabled = true : fasterButton.disabled = false;
    basicSpeed === -2 ? slowerButton.disabled = true : slowerButton.disabled = false;
    changeSpeed();
}

function changeSpeed() {
    let speedDisplay;
    if (basicSpeed === 2) {
        minspeed = 200;
        maxspeed = 400;
        speedDisplay = 'Incredible!!!';
    } if (basicSpeed === 1) {
        minspeed = 200;
        maxspeed = 600;
        speedDisplay = 'Harder!'
    } if (basicSpeed === 0) {
        minspeed = 300;
        maxspeed = 900;
        speedDisplay = 'Medium'
    } if (basicSpeed === -1) {
        minspeed = 450;
        maxspeed = 1200;
        speedDisplay = 'Slower...'
    } if (basicSpeed === -2) {
        minspeed = 600;
        maxspeed = 1400;
        speedDisplay = 'As a Turtle...'
    }
    speedBoard.textContent = `Current speed: ${speedDisplay}`;
}

function saveRecord () {
    if (score > localStorage.getItem('max')) {
        localStorage.setItem('max', score);
    }
    localStorage.getItem('max') === null ? resultBoard.textContent = 'Your record: 0' : 
    resultBoard.textContent = `Your record: ${localStorage.getItem('max')}`;
}

moles.forEach(mole => mole.addEventListener('click', bonk));
startButton.addEventListener('click', startGame);
speedButtons.forEach(button => button.addEventListener('click', changeSpeedSettings));
window.addEventListener('load', changeSpeed);
window.addEventListener('load', saveRecord);
