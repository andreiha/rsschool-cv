const displayOutput = document.getElementById('calc__display__output');
const numbersBtn = document.querySelectorAll('.btn-num');

let InputNumber;
let MemoryNewNumber = false;


numbersBtn.forEach(n => n.addEventListener ('click', function(e) {
    console.log(e.target.textContent);
    numberPress(e.target.textContent);
} ) )


function numberPress (number) {
    let 
    if (MemoryNewNumber) {
        displayOutput.value = number;
        MemoryNewNumber = false;
    } else {
        if (displayOutput.value === '0') {
            displayOutput.value = number;
        } else {
            displayOutput.value += number;
        }
    }
};