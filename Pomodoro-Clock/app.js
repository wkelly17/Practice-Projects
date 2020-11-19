// ! First iteration finished Thursday November 19, 2020 03:06PM; From florinPop --https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Pomodoro-Clock.md
//todo: ideas  1: Long break after every 4th break;   Sound when things finish;
class PomodoroClock {
  constructor() {
    //@@ DOM ELEMENTS

    this.clockInput = document.querySelector('#clockInput');
    this.breakInput = document.querySelector('#breakInput');

    this.clockDisplay = document.querySelector('.clock-display');
    this.breakDisplay = document.querySelector('.break-display');

    this.clockControlButtons = document.querySelectorAll('.clockControls');
    this.startBtn = this.clockControlButtons[0]; //pulling out this button independent to change inner text from start to stop;

    //@@ LOGIC VARIABLES

    this.state = 0; //0 idle, -1 paused, 1 running  2 = on a break;

    this.interval = -1; //set interval won't return neg;
    this.currentTimeout = -1;

    this.timerAmount = 0; //From input fields
    this.timeRemaining = 0; //Will be set when timer starts and subtracted with each interval
    this.breakInterval = -1;
    this.breakTimeout = -1;

    //@@constructor methods
    this.addEventListeners();
  }

  //@@* -------------------- ADDING EVENT LISTENERS ------------------------- */

  addEventListeners() {
    // @% no need for global class available scope.  hence selecting these here;
    //@! Note: Arrow functions are used maintain the class "this" and the DOM 'this' is grabbed through at the top of each class function via passing the event and assigning the dom element as event.target
    let timeIncrementers = document.querySelectorAll('.clock button');

    timeIncrementers.forEach((incrementer) =>
      incrementer.addEventListener('click', (event) =>
        this.manageIncrements(event)
      )
    );

    this.clockControlButtons.forEach((button) =>
      button.addEventListener('click', (event) =>
        this.manageSessionControls(event)
      )
    );
    this.clockInput.addEventListener('change', (event) =>
      this.updateDisplay(event)
    );
    this.breakInput.addEventListener('change', (event) =>
      this.updateDisplay(event)
    );
  }

  //@@=============== CLASS METHODS  =============
  //@#update Display
  updateDisplay(event) {
    let input = event.target;
    if (input.dataset.display == 'session') {
      this.clockDisplay.innerText = `${input.value}:00`;
    } else {
      this.breakDisplay.innerText = `${input.value}:00`;
    }
  }
  //@#manageIncrements
  manageIncrements(event) {
    let button = event.target;

    if (this.state != 0) {
      return; //we want to return if we are not idle;
    }

    if (button.dataset.action == 'decrement') {
      button.nextElementSibling.value =
        Number(button.nextElementSibling.value) - 1;

      //@# update corresponding display
      if (button.dataset.display == 'session') {
        this.clockDisplay.innerText = `${button.nextElementSibling.value}:00`;
      } else {
        this.breakDisplay.innerText = `${button.nextElementSibling.value}:00`;
      }
    }
    //@% incrementing values;
    else {
      button.previousElementSibling.value =
        Number(button.previousElementSibling.value) + 1;
      //@# update corresponding display
      if (button.dataset.display == 'session') {
        this.clockDisplay.innerText = `${button.previousElementSibling.value}:00`;
      } else {
        this.breakDisplay.innerText = `${button.previousElementSibling.value}:00`;
      }
    }
  }

  // @# Session controls
  manageSessionControls(event) {
    let button = event.target; //just to keep "this" value refering to class variables for clarity; Will get passed through functions

    switch (button.dataset.action) {
      case 'startOrPause':
        // @% initial start
        if (button.dataset.action == 'startOrPause' && this.state == 0) {
          this.initialStart();
        }
        //@% pausing
        else if (
          button.dataset.action == 'startOrPause' &&
          (this.state == 1 || this.state == 2)
        ) {
          this.pause();
        }
        //@% Resuming
        else if (button.dataset.action == 'startOrPause' && this.state == -1) {
          // debugger;
          if (this.breakInterval == -1) {
            this.resumeTimer();
          } else {
            this.resumeBreak();
          }
        }
        break;
      // @% Resuming
      case 'stop':
        if (this.state == -1 || this.state == 1 || this.state == 2) {
          //interval is running, or interval is paused;
          clearInterval(this.interval);
          clearTimeout(this.currentTimeout);
          clearInterval(this.breakInterval);
          clearTimeout(this.currentTimeout);
          this.clockDisplay.innerText = 'Timers Stopped';
          this.state = 0;
          this.clockControlButtons[0].innerText = 'Start';
        }
        break;
      // @% Resuming
      case 'reset':
        clearInterval(this.interval);
        clearTimeout(this.currentTimeout);
        clearInterval(this.breakInterval);
        clearTimeout(this.breakTimeout);
        this.clockControlButtons[0].innerText = 'Start';
        this.state = 0;
        this.interval = -1;
        this.currentTimeout = -1;
        this.timerAmount = 0;
        this.timeRemaining = 0;
        this.breakInterval = -1;
        this.breakTimeout = -1;
        this.clockDisplay.innerText = this.clockInput.value;
        this.breakDisplay.innerText = this.breakInput.value;
      // this.initialStart();  //@% optional restart on reset;
      default:
        break;
    }
  }

  // @# Initial starting;
  initialStart() {
    let startingTime = Date.now();
    let then = startingTime + clockInput.value * 60000; //ms.  60k is turning minutes into ms;
    let finished = then - startingTime; //Time after which to clear original interval in ms;
    this.timerAmount = clockInput.value * 60; //seconds to run timer;
    this.timeRemaining = this.timerAmount; //will deduct a second each time from remaining;

    let seconds = finished / 1000;
    let minutes = Math.floor(seconds / 60);
    let remainderSeconds = seconds % 60;

    this.interval = setInterval(() => {
      this.clockDisplay.innerText = `${minutes}:${
        remainderSeconds < 10 ? '0' : ''
      }${remainderSeconds}`;
      seconds--;
      remainderSeconds = seconds % 60;
      minutes = Math.floor(seconds / 60);
      this.timeRemaining -= 1;
    }, 1000);

    this.currentTimeout = setTimeout(() => {
      clearInterval(this.interval);
      this.interval = -1;
      this.state = 2; //break
      this.startBreak();
    }, finished + 1000);

    this.startBtn.innerText = 'Pause';
    this.state = 1; //running
  }

  // @# Pause fxn
  pause() {
    if (this.state == 1) {
      clearInterval(this.interval);
      clearTimeout(this.currentTimeout);
      this.interval = -1;
    } else if (this.state == 2) {
      clearInterval(this.breakInterval);
      clearTimeout(this.breakTimeout);
      //not setting interval to -1 since resume logic decides which interval to resume based on -1 of original break interval;
    }
    this.state = -1; //paused
    this.startBtn.innerText = 'Resume';
  }

  //@# resumeTimer fxn
  resumeTimer() {
    let finishedTime = this.timeRemaining * 1000; //timerRemaining is seconds; making it ms for the clearTimeout;
    let seconds = this.timeRemaining;
    let minutes = Math.floor(seconds / 60);
    let remainderSeconds = seconds % 60;

    this.interval = setInterval(() => {
      this.clockDisplay.innerText = `${minutes}:${
        remainderSeconds < 10 ? '0' : ''
      }${remainderSeconds}`;
      seconds--;
      remainderSeconds = seconds % 60;
      minutes = Math.floor(seconds / 60);
      this.timeRemaining -= 1;
    }, 1000);

    this.currentTimeout = setTimeout(() => {
      clearInterval(this.interval);
      this.state = 2; //break running
      this.startBreak();
    }, finishedTime + 1000); //extra second to let interval finish updating;
    this.startBtn.innerText = 'Pause';
    this.state = 1;
  }

  //@# startingBreak
  startBreak() {
    let startingTime = Date.now();
    let then = startingTime + this.breakInput.value * 60000; //ms.  60k is turning number into minutes;
    this.timerAmount = clockInput.value * 60; //seconds;
    this.timeRemaining = this.timerAmount; //will deduct a second each time;
    let finished = then - startingTime; //Time after which to clear break interval in ms;
    let seconds = finished / 1000;
    let minutes = Math.floor(seconds / 60);
    let remainderSeconds = seconds % 60;

    this.breakInterval = setInterval(() => {
      this.breakDisplay.innerText = `${minutes}:${
        remainderSeconds < 10 ? '0' : ''
      }${remainderSeconds}`;
      seconds--;
      remainderSeconds = seconds % 60;
      minutes = Math.floor(seconds / 60);

      this.timeRemaining -= 1;
    }, 1000);

    this.breakTimeout = setTimeout(() => {
      clearInterval(this.breakInterval);
      this.state = 0;
    }, finished + 1000);

    this.startBtn.innerText = 'Pause';
    this.state = 2;
  }

  //@# resuming from break
  resumeBreak() {
    console.log('resuming');

    let finishedTime = this.timeRemaining * 1000; //timerRemaining is seconds; making it ms;
    let seconds = this.timeRemaining;
    let minutes = Mat                                                                                                                                                                             h.floor(seconds / 60);
    let remainderSeconds = seconds % 60;

    this.breakInterval = setInterval(() => {
      console.log('resuming interval');
      this.breakDisplay.innerText = `${minutes}:${
        remainderSeconds < 10 ? '0' : ''
      }${remainderSeconds}`;
      seconds--;
      remainderSeconds = seconds % 60;
      minutes = Math.floor(seconds / 60);
      this.timeRemaining -= 1;
    }, 1000);
    this.breakTimeout = setTimeout(() => {
      console.log('clearning break time');
      clearInterval(this.breakInterval);
      this.state = 0; //break
    }, finishedTime + 1000);
    this.startBtn.innerText = 'Pause';
    this.state = 2; //resuming break;
  }

  //   ! Final class bracket
}

new PomodoroClock();
