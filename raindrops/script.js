const startScreen = document.getElementById('start-screen');
const startPlayBtn = document.getElementById('start-button__play');
const startHowToPlayBtn = document.getElementById('start-button__how-to-play');

const scoreScreen = document.getElementById('score-screen');
const scoreOKBtn = document.getElementById('score-screen__OK-button');
const statsResult = document.getElementById('stats__result');
const statsRight = document.getElementById('stats__right');
const statsMistakes = document.getElementById('stats__mistakes');

const displayOutput = document.getElementById('calc__display__output');
const calcBtn = document.querySelectorAll('.btn');
const playZone = document.getElementById('play-zone');
const waterZone = document.getElementById('water-zone');

const scoreOutput = document.getElementById('score__output');
const waveSound = document.getElementById('wave-sound');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const audioIcon = document.getElementById('audio-icon');
const fullscreenIcon = document.getElementById('fullscreen-icon');

const сustomizeCheckbox = document.getElementById('сustomize-checkbox');
const customizeTable = document.getElementById('customize-table');
const customizeFirstValueFrom = document.getElementById('first-value__from');
const customizeFirstValueTo = document.getElementById('first-value__to');
const customizeSecondValueFrom = document.getElementById('second-value__from');
const customizeSecondValueTo = document.getElementById('second-value__to');
const customizeWarning = document.getElementById('customize-warning');
const customizeNumberValidation = Array.from(document.querySelectorAll('.value-validation'));
const customizeOperatorValidation = Array.from(document.querySelectorAll('.operator-validation'));
let customizeCheckedOperatorArr = [];

let rainDropHeight = '70px';
let rainDropWidth = '70px';
let rainDropTopPosition = '-70px';
let rainDropPreviousPosition = 0;

let lastOperator = '';
let lastFirstOperand = null;
let lastSecondOperand = null;

let isStartGame = false;
let isHowToPlayMode = false;
let gameScoreStartStep = 10;
let counterRainDrops = 1;
let counterWrongAnswers = 0;
let counterRightAnswers = 0;
let silentMode = false;

const lowWaterLevel = '19%';
const mediumWaterLevel = '29%';
const maxWaterLevel = '39%';
const lowPlayZoneHeight = '65%';
const mediumPlayZoneHeight = '75%';
const maxPlayZoneHeight = '85%';

const rainDropsArr = [];
let nextRainDrop;

let startTimerId = null;
let increaseComplexityTimerId = null;

let manualSetOperand = false;
let firstOperandMin = 6;
let firstOperandMax = 8;
let secondOperandMin = 2;
let secondOperandMax = 8;
let fallingSpeedRainDrops = 25;
let intervalBetweenRainDrops = 6000;


function startGame() {
    isStartGame = !isStartGame;
    isHowToPlayMode = false;
    increaseComplexity();
    if (manualSetOperand) {
        setManualValues();
    }
    toggleSound();
    const firstRainDrop = new RainDrop();
    rainDropsArr.push(firstRainDrop);
    startTimerId = setTimeout(function repeatCalls() {
        ++counterRainDrops;
        if (counterRainDrops % 10 === 0) {
            nextRainDrop = new RainDropExtra();
        }
        else {
            nextRainDrop = new RainDrop();
        }
        rainDropsArr.push(nextRainDrop);
        startTimerId = setTimeout(repeatCalls, intervalBetweenRainDrops); 
    }, intervalBetweenRainDrops);
}

function stopGame() {
    clearInterval(startTimerId);
    clearInterval(increaseComplexityTimerId);
    writeStats();
    isStartGame = false;
    manualSetOperand = false;
    rainDropsArr.forEach(e => e.element.remove());
    rainDropsArr.length = 0;
    refreshToDefault();
    scoreScreen.style.display = 'flex';
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

class RainDropExtra extends RainDrop {
    rainDropExtra = true;
    constructor() {
        super();
        this.element = this.createElement(this.operator, this.firstOperand, this.secondOperand);
    }

    createElement = (operator, firstOperand, secondOperand) => {
        let element = document.createElement('div');
        element.className = 'rain-drop rain-drop_extra';
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
        toggleSound();
        stopGame();
    } else {
        playZone.style.height = maxPlayZoneHeight;
        waterZone.style.height = lowWaterLevel;
    }
}

function setOperator() {
    if (!manualSetOperand) {
        const operatorArr = ['+', '-', '*', '/'];
        let randomIndex = Math.floor(Math.random() * operatorArr.length);
        lastOperator = operatorArr[randomIndex];
        return lastOperator;
    } else {
        let randomIndex = Math.floor(Math.random() * customizeCheckedOperatorArr.length);
        lastOperator = customizeCheckedOperatorArr[randomIndex].dataset.operator;
        return lastOperator;
    }
}

function setFirstOperand() {
    lastFirstOperand = Math.round(firstOperandMin - 0.5 + Math.random() * (firstOperandMax - firstOperandMin + 1));
    return lastFirstOperand;
}

function setSecondOperand() {
    lastSecondOperand = Math.round(secondOperandMin - 0.5 + Math.random() * (secondOperandMax - secondOperandMin + 1));
    if (lastOperator == '/' && lastFirstOperand % lastSecondOperand !== 0) {
        console.log("Замена второго операнда: не / без остатка");
        for (let i = Math.ceil(secondOperandMin); i <= Math.floor(secondOperandMax); i++) {
            if (lastFirstOperand % i === 0) {
                setSecondOperand();
                break;
            } else {
                lastSecondOperand = lastFirstOperand;
            }
        }      
    }
    if (lastOperator == '-' && lastFirstOperand <= lastSecondOperand) {
        console.log("Замена второго операнда: отрицательное или 0 значение при -");
        if (lastFirstOperand <= Math.ceil(secondOperandMin)) {
            lastSecondOperand = lastFirstOperand - 1;
        } else {
            setSecondOperand();
        }
    }
    if (lastOperator == '*' && !manualSetOperand) {
        lastSecondOperand = Math.round(lastSecondOperand / 2);    
    }
    return lastSecondOperand;
}

function pressCalcBtn(value) {
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

function pressKeyboard(e) {
    if (e.code.includes('Digit') || e.code.includes('Numpad') && (e.keyCode >= 96 && e.keyCode <= 105)) {
        if (+displayOutput.value > 999) {
            displayOutput.value = displayOutput.value;
        } else if (displayOutput.value === '' && e.code.includes('0')) {
            displayOutput.value = '';
        } else {
            displayOutput.value = displayOutput.value + e.key;
        }
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
        playCorrectAnswerSound();
        getGameScore('plus');
        ++counterRightAnswers;
        rainDropsArr[0].wasDecided = true;
        rainDropsArr[0].element.style.transform = 'scale(0)';
        rainDropsArr[0].element.style.transition = 'transform 1s';
        if (rainDropsArr[0].rainDropExtra === true) {
            rainDropsArr[0].element.style.boxShadow = '0 0 5px 10px rgba(187, 255, 0, 0.8)';
            rainDropsArr.shift();
            rainDropsArr.forEach(e => {
                e.element.remove();
                e.wasDecided = true;
            });
            rainDropsArr.length = 0;
            playZone.style.height = '';
            waterZone.style.height = '';
        } else {
            rainDropsArr[0].element.style.boxShadow = '0 0 5px 10px rgba(113, 214, 230, 0.8)';
            rainDropsArr.shift();
        }
    } else {
        playWrongAnswerSound();
        rainDropsArr[0].element.style.boxShadow = '0 0 5px 10px rgba(255, 69, 0, 0.8)';
        setTimeout(() => {
            rainDropsArr[0].element.style.boxShadow = '';
        }, 100);
        ++counterWrongAnswers;
    }
}

function toggleSound() {
    waveSound.autoplay = false;
    waveSound.volume = 0.4;
    if (waveSound.paused && waterZone.style.height !== maxWaterLevel) {
        waveSound.play();
        audioIcon.innerHTML = '&#128265;';
        silentMode = false;
    } else {
        waveSound.pause();
        audioIcon.innerHTML = '&#128263;';
        silentMode = true;
    }
}

function playCorrectAnswerSound() {
    if (!silentMode) {
        correctSound.volume = 0.1;
        correctSound.play();
    }
}

function playWrongAnswerSound() {
    if (!silentMode) {
        wrongSound.volume = 0.1;
        wrongSound.play();
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
    statsRight.innerHTML = counterRightAnswers;
    statsMistakes.innerHTML = counterWrongAnswers;
}

function refreshToDefault() {
    gameScoreStartStep = 10;
    scoreOutput.innerHTML = 0;
    counterRainDrops = 0;
    counterWrongAnswers = 0;
    counterRightAnswers = 0;
    firstOperandMin = 6;
    firstOperandMax = 8;
    secondOperandMin = 2;
    secondOperandMax = 8;
    fallingSpeedRainDrops = 25;
    intervalBetweenRainDrops = 6000;
    displayOutput.value = '';
    playZone.removeAttribute('style');
    waterZone.removeAttribute('style');
}

function increaseComplexity() {
    increaseComplexityTimerId = setInterval(() => {
        if (fallingSpeedRainDrops > 7) {
            fallingSpeedRainDrops -= 1.5;
            intervalBetweenRainDrops -= 400;
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

function enableManualValues() {
    if (!сustomizeCheckbox.checked) {
        customizeTable.hidden = true;
        manualSetOperand = false;
        customizeWarning.hidden = true;
    }
    else if (сustomizeCheckbox.checked) {
        customizeTable.hidden = false;
        manualSetOperand = true;
        customizeFirstValueFrom.placeholder = firstOperandMin;
        customizeFirstValueTo.placeholder = firstOperandMax;
        customizeSecondValueFrom.placeholder = secondOperandMin;
        customizeSecondValueTo.placeholder = secondOperandMax;
    }
}

function setManualValues() {
    if (manualSetOperand && customizeNumberValidation.every(e => e.value >= 1 && e.value <= 99)) {
        firstOperandMin = +customizeFirstValueFrom.value;
        firstOperandMax = +customizeFirstValueTo.value;
        secondOperandMin = +customizeSecondValueFrom.value;
        secondOperandMax = +customizeSecondValueTo.value;
        customizeCheckedOperatorArr = customizeOperatorValidation.filter(e => e.checked === true);
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

function startHowToPlayMode() {
    isHowToPlayMode = true;
    startScreen.style.display = 'none';
    isStartGame = !isStartGame;
    toggleSound();
    let drop = new RainDrop('+', 2, 3);
    rainDropsArr.push(drop);
    setTimeout(() => displayOutput.value = '6', 3000);
    setTimeout(() => {
        checkAnswer();
        displayOutput.value = '';
    }, 6000);
    setTimeout(() => displayOutput.value = '5', 8000);
    setTimeout(() => {
        checkAnswer();
        displayOutput.value = '';
    }, 10000);
    setTimeout(() => {
        drop = new RainDrop('*', 2, 2);
        rainDropsArr.push(drop);
    }, 11000);
    setTimeout(() => displayOutput.value = '3', 15000);
    setTimeout(() => {
        checkAnswer();
        displayOutput.value = '';
    }, 17000);
    setTimeout(() => displayOutput.value = '6', 20000);
    setTimeout(() => {
        checkAnswer();
        displayOutput.value = '';
    }, 22000);
    setTimeout(() => {
        drop = new RainDrop('-', 5, 3);
        rainDropsArr.push(drop);
    }, 24000);
    setTimeout(() => displayOutput.value = '1', 28000);
    setTimeout(() => {
        checkAnswer();
        displayOutput.value = '';
    }, 30000);
    setTimeout(() => displayOutput.value = '3', 32000);
    setTimeout(() => {
        checkAnswer();
        displayOutput.value = '';
    }, 34000);
    setTimeout(() => {
        drop = new RainDrop('/', 6, 3);
        rainDropsArr.push(drop);
    }, 35000);
    setTimeout(() => displayOutput.value = '3', 40000);
    setTimeout(() => {
        checkAnswer();
        displayOutput.value = '';
    }, 43000);
}


startPlayBtn.addEventListener('click', () => {
    if (manualSetOperand) {
        if (customizeNumberValidation.every(e => e.value >= 1 && e.value <= 99)) {
            startScreen.style.display = 'none';
            startGame();
        } else {
            customizeWarning.hidden = false;
        }
    } else {
        startScreen.style.display = 'none';
        startGame();
    }
})

startHowToPlayBtn.addEventListener('click', startHowToPlayMode);

scoreOKBtn.addEventListener('click', () => {
    scoreScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    if (!isHowToPlayMode) {
        startPlayBtn.value = 'Play again \u21BA';
    }
})

calcBtn.forEach(v => v.addEventListener('click', (e) => pressCalcBtn(e.target.textContent)));

document.body.addEventListener('keyup', (e) => {
    if (startScreen.style.display === 'none') {
        pressKeyboard(e);
    }
})

сustomizeCheckbox.addEventListener('click', enableManualValues);

audioIcon.addEventListener('click', toggleSound);

fullscreenIcon.addEventListener('click', toggleFullScreen);
