//  ! Color cycler project from Florin POp on github:   Started on Wednesday November 04, 2020 10:18AM;   link:  https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Color-Cycle-App.md

//todo: IDEAS
//Make an input with hsl vs. rgb values. (TOGGLE which fxn via rgb or hsl input)
// add in user choice for interval
//add in notice that default increment is 1;
//change from input = color to just a text input that accepts a 6 or 3 length value. (if 3, each piece would need to be doubled for easy 6 big hex updating)
//If a number is typed in above 25 on inputs, adjust down to 25.

const root = document.documentElement; //used for setting css varialbes
let colorPicker = document.querySelector('#colorpicker');
let pickedColor = colorPicker.value;
const box = document.querySelector('.displayedColor');
const startBtn = document.querySelector('.start-cycle');
const rValueDisplay = document.querySelector('.rvalue');
const gValueDisplay = document.querySelector('.gvalue');
const bValueDisplay = document.querySelector('.bvalue');
const hexDisplay = document.querySelector('.hexDisplay');
let isCycling = false; //control flow structure for start button event listener

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

function cycleColor() {
  //   debugger;

  isCycling = !isCycling;
  console.log(isCycling);

  function cyclingColors() {
    startBtn.innerText = 'Stop';

    //disabling increment changing during cycles
    let redIncrementer = document.querySelector('.redIncrementer');
    redIncrementer.setAttribute('disabled', true);
    let greenIncrementer = document.querySelector('.greenIncrementer');
    greenIncrementer.setAttribute('disabled', true);
    let blueIncrementer = document.querySelector('.blueIncrementer');
    blueIncrementer.setAttribute('disabled', true);

    //getting incrementers and checking Increment value validity
    let redValue = redIncrementer.value;
    redValue == '' ? (redValue = 1) : (redValue = Number(redValue));

    //ternaries are enforcing max/min since inputs are validated through a form submission
    redValue > 25 ? (redValue = 25) : (redValue = redValue);
    redValue < -25 ? (redValue = -25) : (redValue = redValue);
    let greenValue = greenIncrementer.value;
    greenValue == '' ? (greenValue = 1) : (greenValue = Number(greenValue));
    greenValue > 25 ? (greenValue = 25) : (greenValue = greenValue);
    greenValue < -25 ? (greenValue = -25) : (greenValue = greenValue);
    let blueValue = blueIncrementer.value;
    blueValue == '' ? (blueValue = 1) : (blueValue = Number(blueValue));
    blueValue > 25 ? (blueValue = 25) : (blueValue = blueValue);
    blueValue < -25 ? (blueValue = -25) : (blueValue = blueValue);

    // debugger;
    //grabbing initial red and hexRed values
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

    //hexRed
    hexRed += redValue;
    hexRed > 255 ? (hexRed = 0) : (hexRed = hexRed); //! if incrementing over 255
    hexRed < 0 ? (hexRed = 255) : (hexRed = hexRed); //! if decrementing below 0
    //hexGreen
    hexGreen += greenValue;
    hexGreen > 255 ? (hexGreen = 0) : (hexGreen = hexGreen);
    hexGreen < 0 ? (hexGreen = 255) : (hexGreen = hexGreen);
    //hexBlue
    hexBlue += blueValue;
    hexBlue > 255 ? (hexBlue = 0) : (hexBlue = hexBlue);
    hexBlue < 0 ? (hexBlue = 255) : (hexBlue = hexBlue);
    //red
    red = hexRed.toString(16);
    red.length == 1 ? (red = '0' + red) : (red = red); //! used to keep hex values as 6 length values since 3 length values don't work with current setup
    //green
    green = hexGreen.toString(16);
    green.length == 1 ? (green = '0' + green) : (green = green);
    // blue
    blue = hexBlue.toString(16);
    blue.length == 1 ? (blue = '0' + blue) : (blue = blue);

    //check console
    console.log({ red, hexRed, green, hexGreen, blue, hexBlue });
    pickedColor = `#${red}${green}${blue}`;
    //   console.log({ pickedColor });

    //@# update DOM and CSS custom
    rValueDisplay.textContent = 'Red: ' + hexRed;
    gValueDisplay.textContent = 'Green: ' + hexGreen;
    bValueDisplay.textContent = 'Blue: ' + hexBlue;
    hexDisplay.textContent = 'Hex Code: ' + pickedColor;
    colorPicker.value = pickedColor;
    root.style.setProperty(`--colorPicker`, `${pickedColor}`);
  }

  //   const start = function(){
  // 	  return setInterval(cyclingColors, 1000);
  //   }  //? was trying to see if I could used this to cancel interval.

  if (!isCycling) {
    console.log('stopping it');
    clearInterval(start);
    startBtn.innerText = 'Start';
    redIncrementer.removeAttribute('disabled');
    greenIncrementer.removeAttribute('disabled');
    blueIncrementer.removeAttribute('disabled');
    // startBtn.addEventListener('click', cycleColor);
    return;
  }
  //   const start = setInterval(cyclingColors, 1000);
  else {
    start = setInterval(cyclingColors, 1000);
    //? interval id leaks to global state since unset variable type, but I can't figure out how to close over the interval to make it accessible and clearable.  It works this way, but I wanted to see if I could keep my variables within the primary function scopes.  I keep either creating duplicate intervals or getting scoping problems.  It undoes the multiple event listeners though.
    //? I think it is due to this little quirk regarding execution context: Code executed by setInterval() runs in a separate execution context than the function from which it was called. https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
  }
}

colorPicker.addEventListener('input', setInitialBoxColor);
startBtn.addEventListener('click', cycleColor);
