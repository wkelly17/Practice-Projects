//  ! Color cycler project from Florin POp on github:   Started on Wednesday November 04, 2020 10:18AM;   link:  https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Color-Cycle-App.md

//todo: IDEAS
//Make an input with hsl vs. rgb values. (TOGGLE which fxn via rgb or hsl input)
// add in user choice for interval
//add in notice that default increment is 1;
//change from input = color to just a text input that accepts a 6 or 3 length value. (if 3, each piece would need to be doubled for easy 6 big hex updating)


const root = document.documentElement; //used for setting css varialbes
let colorPicker = document.querySelector('#colorpicker');
let pickedColor = colorPicker.value;
const box = document.querySelector('.displayedColor');
const startBtn = document.querySelector('.start-cycle');
const rValueDisplay = document.querySelector('.rvalue');
const gValueDisplay = document.querySelector('.gvalue');
const bValueDisplay = document.querySelector('.bvalue');
const hexDisplay = document.querySelector('.hexDisplay');

function setInitialBoxColor() {
  pickedColor = this.value; //update global to be accessed in cycle color
  root.style.setProperty(`--colorPicker`, `${this.value}`);
  let red = pickedColor.slice(1, 3);
  let hexRed = Number(parseInt(red, 16));

  let green = pickedColor.slice(3, 5);
  let hexGreen = Number(parseInt(green, 16));

  let blue = pickedColor.slice(5);
  let hexBlue = Number(parseInt(blue, 16));
  console.log({ pickedColor });
  rValueDisplay.textContent = 'Red: ' + hexRed;
  gValueDisplay.textContent = 'Green: ' + hexGreen;
  bValueDisplay.textContent = 'Blue: ' + hexBlue;
  hexDisplay.textContent = 'Hex Code: ' + pickedColor;
}

// function resetover255(num) {
//   'checking reset';
//   console.log({ num });
//   if (num > 255) {
//     return (num = 0);
//     console.log(num);
//   }
// }

function cycleColor() {
  startBtn.innerText = 'Stop';
  startBtn.removeEventListener('click', cycleColor);

  //selecting increments and disabling during function
  let redIncrementer = document.querySelector('.redIncrementer');
  redIncrementer.setAttribute('disabled', true);
  let greenIncrementer = document.querySelector('.greenIncrementer');
  greenIncrementer.setAttribute('disabled', true);
  let blueIncrementer = document.querySelector('.blueIncrementer');
  blueIncrementer.setAttribute('disabled', true);

  //checking value validity
  let redValue = redIncrementer.value;
  redValue == '' ? (redValue = 1) : (redValue = Number(redValue));
  let greenValue = greenIncrementer.value;
  greenValue == '' ? (greenValue = 1) : (greenValue = Number(greenValue));
  let blueValue = blueIncrementer.value;
  blueValue == '' ? (blueValue = 1) : (blueValue = Number(blueValue));

  let cycling = setInterval(() => {
    // debugger;
    let red = pickedColor.slice(1, 3);
    let hexRed = Number(parseInt(red, 16));
    console.log({ red, hexRed });
    let green = pickedColor.slice(3, 5);
    let hexGreen = Number(parseInt(green, 16));
    console.log({ green, hexGreen });
    let blue = pickedColor.slice(5);
    let hexBlue = Number(parseInt(blue, 16));
    console.log({ blue, hexBlue });
    //no end index slice to end of string thereby capturing if the last is 1 digit or 2.
    // console.log({ blue, hexBlue });
    hexRed += redValue;
    hexRed > 255 ? (hexRed = 0) : (hexRed = hexRed); //! used to keep hex codes to six di
    hexGreen += greenValue;
    hexGreen > 255 ? (hexGreen = 0) : (hexGreen = hexGreen);
    hexBlue += blueValue;
    hexBlue > 255 ? (hexBlue = 0) : (hexBlue = hexBlue);
    // resetover255(hexRed);
    // resetover255(hexGreen);
    // resetover255(hexBlue);
    // console.log({ hexRed, hexGreen, hexBlue });
    // red = Number(hexRed.toFixed(2)).toString(16);
    red = hexRed.toString(16);
    red.length == 1 ? (red = '0' + red) : (red = red);
    green = hexGreen.toString(16);
    green.length == 1 ? (green = '0' + green) : (green = green);
    // green = Number(hexGreen.toFixed(2)).toString(16);
    blue = hexBlue.toString(16);
    blue.length == 1 ? (blue = '0' + blue) : (blue = blue);
    // blue = Number(hexBlue.toFixed(2)).toString(16);
    console.log({ red, hexRed, green, hexGreen, blue, hexBlue });
    pickedColor = `#${red}${green}${blue}`;
    console.log({ pickedColor });
    rValueDisplay.textContent = 'Red: ' + hexRed;
    gValueDisplay.textContent = 'Green: ' + hexGreen;
    bValueDisplay.textContent = 'Blue: ' + hexBlue;
    hexDisplay.textContent = 'Hex Code: ' + pickedColor;
    root.style.setProperty(`--colorPicker`, `${pickedColor}`);
  }, 1000);

  startBtn.addEventListener('click', () => {
    clearInterval(cycling);
    startBtn.innerText = 'Start';
    redIncrementer.removeAttribute('disabled');
    greenIncrementer.removeAttribute('disabled');
    blueIncrementer.removeAttribute('disabled');
    startBtn.addEventListener('click', cycleColor);
    return;
  });
  // console.log(green++);
}

colorPicker.addEventListener('input', setInitialBoxColor);
startBtn.addEventListener('click', cycleColor);
