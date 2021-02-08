const startDisplay = document.getElementById('start-display');
const playBtn = document.getElementById('start-button__play');
const howToPlayBtn = document.getElementById('start-button__how-to-play');

const displayOutput = document.getElementById('calc__display__output');
const calcBtn = document.querySelectorAll('.btn');
const playZone = document.getElementById('play-zone');
const waterZone = document.getElementById('water-zone');

const audio = document.getElementById('audio');
const audioIcon = document.getElementById('audio-icon');

let rainDropHeight = '70px';
let rainDropWidth = '70px';
let rainDropPreviousPosition = 0;

let Operator = '';
let FirstOperand = null;
let SecondOperand = null;

let gameScore = 0;

const lowWaterLevel = '19%';
const mediumWaterLevel = '29%';
const maxWaterLevel = '39%';
const lowPlayZoneHeight = '65%';
const mediumPlayZoneHeight = '75%';
const maxPlayZoneHeight = '85%';

const answers = [];
const rainDropsMap = new Map();

playBtn.addEventListener('click', () => {
    startDisplay.style.display = 'none';
    startGame();
})

audioIcon.addEventListener('click', audioControl);

calcBtn.forEach(v => v.addEventListener ('click', (e) => calcBtnPress(e.target.textContent)));

document.body.addEventListener('keyup', (e) => {
    if (+displayOutput.value > 999) {
        displayOutput.value = displayOutput.value;
    } else if (e.code.includes('Digit') || e.code.includes('Numpad') && (e.keyCode >= 96 && e.keyCode <= 105)) {
        displayOutput.value = displayOutput.value + e.key;
    };
    if (e.code.includes('Enter')) {
        this.checkValue ();
        console.log('Нажат Enter');
        displayOutput.value = '';
    }
})

function startGame (intervalBetweenRainDrops = 10000, fallingSpeedRainDrops) {
    new RainDrop(fallingSpeedRainDrops);
    audioControl ();
    let startTimer = setInterval (() => {
        if (playZone.style.height !== mediumPlayZoneHeight) {
            new RainDrop(fallingSpeedRainDrops);
        };
        if (playZone.style.height === mediumPlayZoneHeight) {
            clearInterval(startTimer);
        };
    }, intervalBetweenRainDrops);
}
class RainDrop {
    element = null;
    
    constructor(fallingSpeedRainDrops) {
        setOperator();
        setFirstOperand();
        setSecondOperand();
        this.addAnswer();
        this.element = this.createElement();
        this.moveDownElement(fallingSpeedRainDrops);
    }
    
    createElement = () => {
        let element = document.createElement('div');
        element.className = 'rain-drop';
        element.style.height = rainDropHeight;
        element.style.width = rainDropWidth;
        element.style.left = `${setStartPosition()}px`;
        element.style.top = '-70px';
        playZone.append(element);

        let operator = document.createElement('div');
        operator.className = 'operator';
        operator.innerHTML = Operator;
        element.append(operator);

        let operands = document.createElement('div');
        operands.className = 'operands';
        element.append(operands);

        let operOne = document.createElement('div');
        operOne.className = 'operand__one';
        operOne.innerHTML = FirstOperand;
        operands.append(operOne);

        let operTwo = document.createElement('div');
        operTwo.className = 'operand__two';
        operTwo.innerHTML = SecondOperand;
        operands.append(operTwo);

        return element;
    }
    deleteElement = () => {
        this.element.remove();
    }

    moveDownElement = (fallingSpeedRainDrops = 30) => {
        let numRainDropHeight = parseInt(rainDropHeight);
        let maxTop = playZone.offsetHeight - numRainDropHeight;
        console.log(maxTop);
        let timerId = setInterval (() => {
            this.element.style.top = (parseInt(this.element.style.top) + 1) + 'px';
            if (parseInt(this.element.style.top) >= maxTop) {
                clearInterval(timerId);
                this.deleteElement();
                moveWaves();
            }
        }, fallingSpeedRainDrops);
    }

    addAnswer = () => {
        let result = null;
        if (Operator === '+') {
            result = FirstOperand + SecondOperand;        
        } else if (Operator === '-') {
            result = FirstOperand - SecondOperand;
        } else if (Operator === '*') {
            result = FirstOperand * SecondOperand;
        } else if (Operator === '/') {
            result = FirstOperand / SecondOperand;
        }
        console.log(result);
        answers.push(result);
        console.log(answers);
    }
}

function setStartPosition() {
      let numRainDropWidth = parseInt(rainDropWidth);
      let startPosition = Math.random() * (playZone.offsetWidth - numRainDropWidth);
      console.log(startPosition);
      console.log(rainDropPreviousPosition);
      if (startPosition > rainDropPreviousPosition - numRainDropWidth && startPosition < rainDropPreviousPosition + numRainDropWidth) {
        console.log("Перезапуск функции, капля поверх предыдущей");
        return setStartPosition();
      }
      rainDropPreviousPosition = startPosition;
      return startPosition;
}

function moveWaves() {
    if (playZone.style.height === maxPlayZoneHeight) {
        playZone.style.height = mediumPlayZoneHeight;
        waterZone.style.height = mediumWaterLevel;
    } else if (playZone.style.height === mediumPlayZoneHeight) {
        playZone.style.height = lowPlayZoneHeight;
        waterZone.style.height = maxWaterLevel;
        audioControl ();
    } else if (playZone.style.height === lowPlayZoneHeight) {
        console.log("Максимальный уровень воды");
    } else {
        playZone.style.height = maxPlayZoneHeight;
        waterZone.style.height = lowWaterLevel;
    }
}

function setOperator (min = 1, max = 4) {
    let value = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    if (value === 1) {
        Operator = '+';
    } else if (value === 2) {
        Operator = '-';
    } else if (value === 3) {
        Operator = '*';
    } else if (value === 4) {
        Operator = '/';
    }
    return Operator; 
}

function setFirstOperand (min = 5, max = 20) {
    FirstOperand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    return FirstOperand;
}

function setSecondOperand (min = 2, max = 10) {
    SecondOperand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    if (Operator == '/' && FirstOperand > max) {
        console.log("Замена второго операнда: нет делителя в диапазоне");
        SecondOperand = FirstOperand;
    } else if (Operator == '/' && FirstOperand % SecondOperand !== 0) {
        console.log("Замена второго операнда: не / без остатка");
        setSecondOperand (min, max);
    }
    if (Operator == '-' && FirstOperand < SecondOperand) {
        console.log("Замена второго операнда: отрицательное значение при -");
        setSecondOperand (min, max);
    }
    if (Operator == '-' && FirstOperand === SecondOperand) {
        console.log("Замена второго операнда: результат равен 0 при -");
        setSecondOperand (min, max);
    }
    return SecondOperand;
}

function calcBtnPress (value) {
    console.log(value);
    if (value === 'Clear') {
        displayOutput.value = '';
    } else if (value === 'Delete') {
        displayOutput.value = displayOutput.value.slice(0, -1);
    } else if (value === 'Enter') {
        this.checkValue ();
        console.log('Значение передано функции');
        displayOutput.value = '';
    } else {
        if (+displayOutput.value > 999) {
            displayOutput.value = displayOutput.value;
        } else if (displayOutput.value === '' && value === '0') {
            displayOutput.value = '';
        } else {
            displayOutput.value += value;
        }
    }
};

function checkValue () {
    let firstRainDrop = document.querySelector('#play-zone > div');
    if (answers[0] == Number(displayOutput.value)) {
        answers.shift();
        firstRainDrop.remove();



    }
}

function audioControl () {
    audio.autoplay = false;
    audio.volume = 0.4;
    if (audio.paused) {
        audio.play();
        audioIcon.innerHTML = '&#128265;';
    } else {
        audio.pause();
        audioIcon.innerHTML = '&#128263;';
    }
}
