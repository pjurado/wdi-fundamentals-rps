# Simple Calculator

A modern, responsive calculator built with HTML, CSS, and JavaScript featuring a clean UI and full keyboard support.

## Features

- **Basic Operations**: Addition, subtraction, multiplication, and division
- **Modern UI**: Clean, responsive design with gradient background and button animations
- **Keyboard Support**: Full keyboard input support for all operations
- **Error Handling**: Division by zero protection and graceful error display
- **Visual Feedback**: Button hover effects and calculation flash animations
- **Responsive Design**: Works on desktop and mobile devices

## Usage

### Running the Calculator

1. Start a local server in the app directory:
   ```bash
   cd app
   python3 -m http.server 8000
   ```

2. Open your browser and navigate to `http://localhost:8000`

### Controls

**Mouse/Touch:**
- Click number buttons (0-9) to input numbers
- Click operation buttons (+, -, ×, /) for calculations
- Click = to calculate result
- Click C to clear all
- Click CE to clear current entry
- Click ⌫ to delete last digit

**Keyboard:**
- Number keys (0-9) for input
- +, -, *, / for operations
- Enter or = to calculate
- Escape to clear all
- Backspace to delete last digit
- . for decimal point

## Project Structure

```
app/
├── index.html          # Main HTML file
├── styles/
│   └── main.css       # Calculator styling
└── js/
    └── calculator.js  # Calculator functionality
```

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers
