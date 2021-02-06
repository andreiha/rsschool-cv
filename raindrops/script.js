const displayOutput = document.getElementById('calc__display__output');
const calcBtn = document.querySelectorAll('.btn');
const playZone = document.getElementById('play-zone');
const waterZone = document.getElementById('water-zone');

let rainDropHeight = '70px';
let rainDropWidth = '70px';
let rainDropPreviousPosition = 0;

let FirstOperand = null;
let SecondOperand = null;
let Operator = "";

calcBtn.forEach(v => v.addEventListener ('click', (e) => calcBtnPress(e.target.textContent)));

function startGame () {
    new RainDrop;
    let newRa = setTimeout(function startg() {
        new RainDrop;
        timerId = setTimeout(startg, 2000);
      }, 2000);
}
class RainDrop {
    element = null;
    
    constructor(top = '70px', operator = '+', operandOne = 10, operandTwo = 2) {
        setOperator();
        setFirstOperand();
        setSecondOperand();
        this.element = this.createElement(top, operator, operandOne, operandTwo);
        this.moveDownElement();
    }
    
    createElement = (top, operator, operandOne, operandTwo) => {
        let element = document.createElement('div');
        element.className = 'rain-drop';
        element.style.height = rainDropHeight;
        element.style.width = rainDropWidth;
        element.style.left = `${setStartPosition()}px`;
        element.style.top = '-70px';
        playZone.append(element);

        let oper = document.createElement('div');
        oper.className = 'operator';
        oper.innerHTML = Operator;
        element.append(oper);

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

    moveDownElement = (downPixelsPerTimeInt = 1, downTimeInt = 1) => {
        let numRainDropHeight = parseInt(rainDropHeight);
        let maxTop = playZone.offsetHeight - numRainDropHeight;
        console.log(maxTop);
        let timerId = setInterval (() => {
            this.element.style.top = (parseInt(this.element.style.top) + downPixelsPerTimeInt) + 'px';
            if (parseInt(this.element.style.top) >= maxTop) {
                clearInterval(timerId);
                this.deleteElement();
                moveWaves();
            }
        },downTimeInt);
    }

    compare
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

function setDropSpeed() {
    return 20;
}

function moveWaves() {
    if (playZone.style.height === '85%') {
        playZone.style.height = '75%';
        waterZone.style.height = '29%';
    } else if (playZone.style.height === '75%') {
        playZone.style.height = '65%';
        waterZone.style.height = '39%';
    } else if (playZone.style.height === '65%') {
        console.log("Максимальный уровень воды");
    } else {
        playZone.style.height = '85%';
        waterZone.style.height = '19%';
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

function setFirstOperand (min = 10, max = 20) {
    FirstOperand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    return FirstOperand;
}

function setSecondOperand (min = 10, max = 20) {
    SecondOperand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    if (Operator == '/' && FirstOperand % SecondOperand !== 0) {
        console.log("Замена второго операнда");
        setSecondOperand (min, max);
    }
    if (Operator == '-' && FirstOperand < SecondOperand) {
        console.log("Замена второго операнда");
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