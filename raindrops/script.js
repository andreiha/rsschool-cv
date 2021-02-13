const startScreen = document.getElementById('start-screen');
const startPlayBtn = document.getElementById('start-button__play');
const startHowToPlayBtn = document.getElementById('start-button__how-to-play');

const finishScreen = document.getElementById('finish-screen');
const finishPlayBtn = document.getElementById('finish-button__play');
const finishHowToPlayBtn = document.getElementById('finish-button__how-to-play');
const statsResult = document.getElementById('stats__result');
const statsRight = document.getElementById('stats__right');
const statsMistakes = document.getElementById('stats__mistakes');

const displayOutput = document.getElementById('calc__display__output');
const calcBtn = document.querySelectorAll('.btn');
const playZone = document.getElementById('play-zone');
const waterZone = document.getElementById('water-zone');

const scoreOutput = document.getElementById('score__output');
const audio = document.getElementById('audio');
const audioIcon = document.getElementById('audio-icon');

let rainDropHeight = '70px';
let rainDropWidth = '70px';
let rainDropTopPosition = '-70px';
let rainDropPreviousPosition = 0;

let lastOperator = '';
let lastFirstOperand = null;
let lastSecondOperand = null;

let isStartGame = false;
let gameScoreStartStep = 10;
let counterScore = 0;
let counterMistakes = 0;
let counterRight = 0;

const lowWaterLevel = '19%';
const mediumWaterLevel = '29%';
const maxWaterLevel = '39%';
const lowPlayZoneHeight = '65%';
const mediumPlayZoneHeight = '75%';
const maxPlayZoneHeight = '85%';

const rainDropsArr = [];

let startTimerId = null;
let increaseComplexityTimerId = null;

let manualSetOperand = false;
let firstOperandMin = 6;
let firstOperandMax = 8;
let secondOperandMin = 2;
let secondOperandMax = 8;
let fallingSpeedRainDrops = 25;
let intervalBetweenRainDrops = 8000;


function startGame() {
    isStartGame = !isStartGame;
    increaseComplexity();
    refreshToDefault();
    audioControl();
    const firstRainDrop = new RainDrop();
    rainDropsArr.push(firstRainDrop);
    startTimerId = setTimeout(function repeatCalls() {
        const nextRainDrop = new RainDrop();
        rainDropsArr.push(nextRainDrop);
        startTimerId = setTimeout(repeatCalls, intervalBetweenRainDrops);
        console.log('Перезапуск Raindrops'); 
    }, intervalBetweenRainDrops);
}

function stopGame() {
    clearInterval(startTimerId);
    clearInterval(increaseComplexityTimerId);
    writeStats();
    isStartGame = false;
    rainDropsArr.forEach(e => e.element.remove());
    rainDropsArr.length = 0;
    finishScreen.style.display = 'flex';
}

class RainDrop {
    element = undefined;
    firstOperand = undefined;
    secondOperand = undefined;
    operator = undefined;
    result = undefined;
    timerMoveDownElement = undefined;
    wasDecided = false;

    constructor(operator, operandOne, operandTwo) {
        this.operator = operator || setOperator();
        this.firstOperand = operandOne || setFirstOperand();
        this.secondOperand = operandTwo || setSecondOperand();
        this.result = getResult(this.firstOperand, this.secondOperand, this.operator);
        this.element = this.createElement(this.operator, this.firstOperand, this.secondOperand);
        this.moveDownElement();
    }

    createElement = (operator, firstOperand, secondOperand) => {
        let element = document.createElement('div');
        element.className = 'rain-drop';
        element.style.height = rainDropHeight;
        element.style.width = rainDropWidth;
        element.style.left = `${setStartPosition()}px`;
        element.style.top = rainDropTopPosition;
        playZone.append(element);

        let oper = document.createElement('div');
        oper.className = 'operator';
        oper.innerHTML = operator === '/' ? '&#247;' : operator === '*' ? '&#215;' : operator;
        element.append(oper);

        let operands = document.createElement('div');
        operands.className = 'operands';
        element.append(operands);

        let operOne = document.createElement('div');
        operOne.className = 'operand__one';
        operOne.innerHTML = firstOperand;
        operands.append(operOne);

        let operTwo = document.createElement('div');
        operTwo.className = 'operand__two';
        operTwo.innerHTML = secondOperand;
        operands.append(operTwo);

        return element;
    }

    moveDownElement = () => {
        let numRainDropHeight = parseInt(rainDropHeight);
        let maxTop = playZone.offsetHeight - numRainDropHeight;
        this.timerMoveDownElement = setInterval(() => {
            if (!isStartGame) {
                clearInterval(this.timerMoveDownElement);
            }
            this.element.style.top = (parseInt(this.element.style.top) + 1) + 'px';
            if (parseInt(this.element.style.top) >= maxTop && !this.wasDecided) {
                moveWaves();
                rainDropsArr.shift();
                this.element.remove();
                clearInterval(this.timerMoveDownElement);
                getGameScore('minus');
            }
        }, fallingSpeedRainDrops);
    }
}

function getResult(firstValue, secondValue, operator) {
    if (operator === '+') {
        return firstValue + secondValue;
    } else if (operator === '-') {
        return firstValue - secondValue;
    } else if (operator === '*') {
        return firstValue * secondValue;
    } else if (operator === '/') {
        return firstValue / secondValue;
    }
}

function setStartPosition() {
    let numRainDropWidth = parseInt(rainDropWidth);
    let startPosition = Math.random() * (playZone.offsetWidth - numRainDropWidth);
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
        audioControl();
        stopGame();
    } else {
        playZone.style.height = maxPlayZoneHeight;
        waterZone.style.height = lowWaterLevel;
    }
}

function setOperator(min = 1, max = 4) {
    let value = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    if (value === 1) {
        lastOperator = '+';
    } else if (value === 2) {
        lastOperator = '-';
    } else if (value === 3) {
        lastOperator = '*';
    } else if (value === 4) {
        lastOperator = '/';
    }
    return lastOperator;
}

function setFirstOperand() {
    lastFirstOperand = Math.round(firstOperandMin - 0.5 + Math.random() * (firstOperandMax - firstOperandMin + 1));
    return lastFirstOperand;
}

function setSecondOperand() {
    lastSecondOperand = Math.round(secondOperandMin - 0.5 + Math.random() * (secondOperandMax - secondOperandMin + 1));
    if (lastOperator == '/' && lastFirstOperand > secondOperandMax) {
        console.log("Замена второго операнда: нет делителя в диапазоне");
        lastSecondOperand = lastFirstOperand;
    } else if (lastOperator == '/' && lastFirstOperand % lastSecondOperand !== 0) {
        console.log("Замена второго операнда: не / без остатка");
        setSecondOperand();
    }
    if (lastOperator == '-' && lastFirstOperand < lastSecondOperand) {
        console.log("Замена второго операнда: отрицательное значение при -");
        setSecondOperand();
    }
    if (lastOperator == '-' && lastFirstOperand === lastSecondOperand) {
        console.log("Замена второго операнда: результат равен 0 при -");
        setSecondOperand();
    }
    if (lastOperator == '*') {
        lastSecondOperand = Math.round(lastSecondOperand / 2);    
    }
    return lastSecondOperand;
}

function calcBtnPress(value) {
    if (value === 'Clear') {
        displayOutput.value = '';
    } else if (value === 'Delete') {
        displayOutput.value = displayOutput.value.slice(0, -1);
    } else if (value === 'Enter') {
        checkAnswer(displayOutput.value);
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

function keyboardPress(e) {
    if (+displayOutput.value > 999) {
        displayOutput.value = displayOutput.value;
    } else if (e.code.includes('Digit') || e.code.includes('Numpad') && (e.keyCode >= 96 && e.keyCode <= 105)) {
        displayOutput.value = displayOutput.value + e.key;
    };
    if (e.code.includes('Enter')) {
        checkAnswer(displayOutput.value);
        displayOutput.value = '';
    }
    if (e.code.includes('Backspace')) {
        displayOutput.value = displayOutput.value.slice(0, -1);
    }
}

function checkAnswer() {
    if (rainDropsArr[0].result === Number(displayOutput.value)) {
        rainDropsArr[0].element.style.boxShadow = '0 0 5px 10px rgba(100, 230, 95, 0.8)';
        rainDropsArr[0].element.style.transform = 'scale(0)';
        rainDropsArr[0].element.style.transition = 'transform 1s';
        rainDropsArr[0].wasDecided = true;
        rainDropsArr.shift();
        getGameScore('plus');
        ++counterRight;
    } else if (rainDropsArr[0].result !== Number(displayOutput.value)) {
        rainDropsArr[0].element.style.boxShadow = '0 0 5px 10px rgba(255, 69, 0, 0.8)';
        setTimeout(() => {
            rainDropsArr[0].element.style.boxShadow = '';
        }, 100);
        ++counterMistakes;
    }
}

function audioControl() {
    audio.autoplay = false;
    audio.volume = 0.4;
    if (audio.paused && waterZone.style.height !== maxWaterLevel) {
        audio.play();
        audioIcon.innerHTML = '&#128265;';
    } else {
        audio.pause();
        audioIcon.innerHTML = '&#128263;';
    }
}

function getGameScore(direction) {
    if (direction === 'plus') {
        if (scoreOutput.innerHTML === '0') {
            scoreOutput.innerHTML = gameScoreStartStep;
            ++gameScoreStartStep;
        } else {
            scoreOutput.innerHTML = +scoreOutput.innerHTML + gameScoreStartStep;
            ++gameScoreStartStep;
        }
    }
    if (direction === 'minus') {
        if (scoreOutput.innerHTML !== '0' || +scoreOutput.innerHTML < 0) {
            scoreOutput.innerHTML = +scoreOutput.innerHTML - gameScoreStartStep;
            --gameScoreStartStep;
            if (+scoreOutput.innerHTML < 0) {
                scoreOutput.innerHTML = 0;
            }
        }
    }
}

function writeStats() {
    statsResult.innerHTML = scoreOutput.innerHTML;
    statsRight.innerHTML = counterRight;
    statsMistakes.innerHTML = counterMistakes;
}

function refreshToDefault() {
    gameScoreStartStep = 10;
    scoreOutput.innerHTML = 0;
    counterMistakes = 0;
    counterRight = 0;
    firstOperandMin = 6;
    firstOperandMax = 8;
    secondOperandMin = 2;
    secondOperandMax = 8;
    fallingSpeedRainDrops = 25;
    intervalBetweenRainDrops = 8000;
    playZone.removeAttribute('style');
    waterZone.removeAttribute('style');
}

function increaseComplexity() {
    increaseComplexityTimerId = setInterval(() => {
        if (fallingSpeedRainDrops > 9) {
            fallingSpeedRainDrops -= 1.5;
            intervalBetweenRainDrops -= 450;
            console.log(`Увеличена скорость падения капель, значение: ${fallingSpeedRainDrops}, интервал: ${intervalBetweenRainDrops}`);
        }
        if (!manualSetOperand) { 
            firstOperandMin += 0.2;
            ++firstOperandMax;
            secondOperandMin += 0.2;
            secondOperandMax += 0.5;
            console.log(`Сложность: firstOp(${firstOperandMin}, ${firstOperandMax}), secondOp(${secondOperandMin}, ${secondOperandMax})`);
        }
    }, 10000);
}

startPlayBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    startGame();
})

finishPlayBtn.addEventListener('click', () => {
    finishScreen.style.display = 'none';
    startGame();
})

audioIcon.addEventListener('click', audioControl);

calcBtn.forEach(v => v.addEventListener('click', (e) => calcBtnPress(e.target.textContent)));

document.body.addEventListener('keyup', (e) => keyboardPress(e));
