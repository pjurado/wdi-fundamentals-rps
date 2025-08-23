// Calculator State
let currentInput = '0';
let previousInput = '';
let operator = null;
let waitingForOperand = false;

// Get display element
const display = document.getElementById('result');

// Update display function
function updateDisplay() {
    display.value = currentInput;
}

// Append to display function
function appendToDisplay(value) {
    if (waitingForOperand) {
        currentInput = value;
        waitingForOperand = false;
    } else {
        if (currentInput === '0') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    }
    updateDisplay();
}

// Clear display function
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForOperand = false;
    updateDisplay();
}

// Clear entry function
function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

// Delete last character function
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Perform calculation
function performCalculation(firstOperand, secondOperand, operator) {
    const first = parseFloat(firstOperand);
    const second = parseFloat(secondOperand);
    
    switch (operator) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '*':
            return first * second;
        case '/':
            if (second === 0) {
                throw new Error('Cannot divide by zero');
            }
            return first / second;
        default:
            return second;
    }
}

// Calculate function
function calculate() {
    if (operator && previousInput !== '' && !waitingForOperand) {
        try {
            const result = performCalculation(previousInput, currentInput, operator);
            
            // Handle floating point precision
            const roundedResult = Math.round(result * 100000000) / 100000000;
            
            currentInput = roundedResult.toString();
            previousInput = '';
            operator = null;
            waitingForOperand = true;
            
            // Add flash effect
            display.classList.add('flash');
            setTimeout(() => {
                display.classList.remove('flash');
            }, 100);
            
            updateDisplay();
        } catch (error) {
            currentInput = 'Error';
            updateDisplay();
            // Reset after showing error
            setTimeout(() => {
                clearDisplay();
            }, 1500);
        }
    }
}

// Handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    
    if (previousInput === '') {
        previousInput = currentInput;
    } else if (operator) {
        const currentValue = previousInput || '0';
        try {
            const result = performCalculation(currentValue, currentInput, operator);
            const roundedResult = Math.round(result * 100000000) / 100000000;
            
            currentInput = roundedResult.toString();
            previousInput = currentInput;
        } catch (error) {
            currentInput = 'Error';
            updateDisplay();
            setTimeout(() => {
                clearDisplay();
            }, 1500);
            return;
        }
    }
    
    waitingForOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Enhanced appendToDisplay to handle operators
window.appendToDisplay = function(value) {
    // Handle decimal point
    if (value === '.') {
        if (currentInput.indexOf('.') === -1) {
            if (waitingForOperand) {
                currentInput = '0.';
                waitingForOperand = false;
            } else {
                currentInput += '.';
            }
            updateDisplay();
        }
        return;
    }
    
    // Handle operators
    if (['+', '-', '*', '/'].includes(value)) {
        handleOperator(value);
        return;
    }
    
    // Handle numbers
    if (waitingForOperand) {
        currentInput = value;
        waitingForOperand = false;
    } else {
        if (currentInput === '0') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    }
    updateDisplay();
};

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Handle number keys
    if ('0123456789'.includes(key)) {
        appendToDisplay(key);
    }
    
    // Handle operator keys
    else if (key === '+' || key === '-') {
        handleOperator(key);
    }
    else if (key === '*') {
        handleOperator('*');
    }
    else if (key === '/') {
        handleOperator('/');
    }
    
    // Handle decimal point
    else if (key === '.') {
        appendToDisplay('.');
    }
    
    // Handle equals and enter
    else if (key === '=' || key === 'Enter') {
        calculate();
    }
    
    // Handle clear
    else if (key === 'Escape') {
        clearDisplay();
    }
    
    // Handle backspace
    else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    
    // Add visual feedback for button presses
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// Expose functions globally for onclick handlers
window.clearDisplay = clearDisplay;
window.clearEntry = clearEntry;
window.deleteLast = deleteLast;
window.calculate = calculate;