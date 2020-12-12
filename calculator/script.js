let numbers = document.querySelectorAll('.number');
let operations = document.querySelectorAll('.operator');
let clearBtns = document.querySelectorAll('.clear-btn');
let decimalBtn = document.getElementById('decimal');
let display = document.getElementById('display');
let MemoryCurrentNumber = 0;
let MemoryNewNumber = false;
let NegativeNumber = true;
let MemoryPendingOperation = '';

for (let i = 0; i < numbers.length; i++) {
    let number = numbers[i];
    number.addEventListener('click', function(e) {
        numberPress(e.target.textContent);
    });
};

for (let i = 0; i < operations.length; i++) {
    let operationBtn = operations[i];
    operationBtn.addEventListener('click', function(e) {
        operation(e.target.textContent);
    });
};

for (let i = 0; i < clearBtns.length; i++) {
    let clearBtn = clearBtns[i];
    clearBtn.addEventListener('click', function (e) {
        clear (e.srcElement.id);
    });
};

decimalBtn.addEventListener('click', decimal);

function numberPress (number) {
    NegativeNumber = false;
    if (MemoryNewNumber) {
        display.value = number;
        MemoryNewNumber = false;
    } else {
        if (display.value === '0') {
            display.value = number;
        } else {
            display.value += number;
        }
    }
};

function operation (op) {
    let localOperationMemory = display.value;
    if (op === '-' && NegativeNumber) {
        display.value = '-';
        MemoryNewNumber = false;
        NegativeNumber = false;
        return;
    }
    if (localOperationMemory === '-') {
        if (op === '-') {
        display.value = '0';
        NegativeNumber = true;
        }
        return;
    }
    NegativeNumber = true;
    
    if (MemoryNewNumber && MemoryPendingOperation !== '=') {
        display.value = MemoryCurrentNumber;
    } else {
        MemoryNewNumber = true;
        if (MemoryPendingOperation === '+') {
            MemoryCurrentNumber = (MemoryCurrentNumber+(+localOperationMemory)).toFixed(6).replace(/0*$/,"");
            if (MemoryCurrentNumber[MemoryCurrentNumber.length-1] = ".") {
                MemoryCurrentNumber = MemoryCurrentNumber.replace(/\.*$/,"");
            }
        } else if (MemoryPendingOperation === '-') {
            MemoryCurrentNumber = (MemoryCurrentNumber-(+localOperationMemory)).toFixed(6).replace(/0*$/,"");
            if (MemoryCurrentNumber[MemoryCurrentNumber.length-1] = ".") {
                MemoryCurrentNumber = MemoryCurrentNumber.replace(/\.*$/,"");
            }
        } else if (MemoryPendingOperation === '*') {
            MemoryCurrentNumber = (MemoryCurrentNumber*(+localOperationMemory)).toFixed(6).replace(/0*$/,"");
            if (MemoryCurrentNumber[MemoryCurrentNumber.length-1] = ".") {
                MemoryCurrentNumber = MemoryCurrentNumber.replace(/\.*$/,"");
            }
        } else if (MemoryPendingOperation === '/') {
            MemoryCurrentNumber = (MemoryCurrentNumber/(+localOperationMemory)).toFixed(6).replace(/0*$/,"");
            if (MemoryCurrentNumber[MemoryCurrentNumber.length-1] = ".") {
                MemoryCurrentNumber = MemoryCurrentNumber.replace(/\.*$/,"");
            }
        } else if (MemoryPendingOperation === '^') {
            MemoryCurrentNumber = Math.pow(MemoryCurrentNumber, localOperationMemory);
        } else if (MemoryPendingOperation === '√') {
            MemoryCurrentNumber = Math.sqrt(localOperationMemory);
        } else {
            MemoryCurrentNumber = parseFloat(localOperationMemory);
        };
        display.value = MemoryCurrentNumber;
        MemoryPendingOperation = op;
    }
    if (MemoryPendingOperation === "√") {
        MemoryNewNumber = false; 
    }
};

function decimal () {
    let localDecimalMemory = display.value;

    if (MemoryNewNumber) {
        localDecimalMemory = '0.';
        MemoryNewNumber = false;
    } else {
        if (localDecimalMemory.indexOf('.') === -1) {
        localDecimalMemory += '.';
        }
    }
    display.value = localDecimalMemory;
};

function clear (id) {
    if (id === 'ce') {
        display.value = '0';
        MemoryNewNumber = true;
    } else if (id === 'c') {
        display.value = '0';
        MemoryNewNumber = true;
        MemoryCurrentNumber = 0;
        MemoryPendingOperation = '';
    }
};