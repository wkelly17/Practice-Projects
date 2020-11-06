// ! Countdown Timer Project started from FlorinPop list on Thursday November 05, 2020 09:19AM:   Link w/ user stories @  -https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Countdown-Timer-App.md

const addEventBtn = document.querySelector('.startBtn');
const eventNameInput = document.querySelector('#eventName');
const datePicker = document.querySelector('#datePicker');
const timePicker = document.querySelector('#timePicker');
const eventsContainer = document.querySelector('.events-container');

function addTimer(event) {
  event.preventDefault();
  //@# Works:  Validates event is named per user stories;
  // if (!eventName.value) {
  //   return alert("Don't forget to name your event!");
  // }

  //@#=============== DATE INPUT  =============
  const now = Date.now(); //milliseconds
  let timeZoneOffsetMs = datePicker.valueAsDate.getTimezoneOffset() * 60 * 1000; //returns minutes difference.  Converting to MS;
  const then = datePicker.valueAsNumber + timeZoneOffsetMs; //accounting for GMT differences;

  //@#=============== TIME INPUT  =============
  const timeOfDayValueMs = timePicker.valueAsNumber; //returns ms;
  const timeofDay = timePicker.value;
  const convertedTimeOfDay = convertTargetTime(timeofDay);
  console.log({ convertedTimeOfDay });
  let targetDate = datePicker.value;

  let timeDifference = then - now + timeOfDayValueMs; //ms

  if (timeDifference <= 0) {
    alert('That already happened!');
  }

  let { lastDisplay, lastCancelBtn } = createEventCountdown(
    targetDate,
    convertedTimeOfDay
  );
  console.log(lastDisplay, lastCancelBtn);
  //   debugger;
  updateTime(timeDifference, lastDisplay, lastCancelBtn);
}

function createEventCountdown(targetDate, convertedTimeOfDay) {
  let event = document.createElement('div');
  event.classList.add('event');
  eventsContainer.appendChild(event);
  eventHeading = eventNameInput.value;
  event.innerHTML += `
  <h3 class="eventName">${eventHeading}</h3>
	  <p>Target Date: ${targetDate}</p>
	  <p>Target Time: ${convertedTimeOfDay}</p>
	  <div class="time-left">
		
	  </div>
	  <button class = "cancelBtn" data-interval = ""> Cancel Countdown </button>
  `;
  let timeDisplays = document.querySelectorAll('.time-left');
  let cancelBtns = document.querySelectorAll('.cancelBtn');
  let lastCancelBtn = cancelBtns[cancelBtns.length - 1];
  let lastDisplay = timeDisplays[timeDisplays.length - 1];
  return { lastDisplay, lastCancelBtn };
}

function updateTime(timeDifference, timeDisplay, cancelBtn) {
  let dateInterval = setInterval(() => {
    let seconds = Math.round(timeDifference / 1000); //
    let remainderSeconds = seconds % 60;
    let minutes = Math.floor(seconds / 60);
    let remainderMinutes = minutes % 60;
    let hours = Math.floor(minutes / 60);
    let remainderHours = hours % 24;
    let days = Math.floor(hours / 24);
    // let remainderDays = days % 24; //!Not acutally needed since there isn't an equal number of days in the months.  Hence days to years.
    let years = Math.floor(days / 365);
    let remainderYears = years % 365;
    timeDifference -= 1000; //taking away a second every second.  I oringinally was running date.now in the interval, and pulling the values in from the inputs, but then the display would update when I tried to make a second timer.

    console.log({
      timeDifference,
      seconds,
      remainderSeconds,
      minutes,
      remainderMinutes,
      hours,
      remainderHours,
      days,
    });

    //todo: I would like to know how to only show an element if it's not 0.  I guess i'd need to know time left for each unit whenver I create the display being passed in as a parameter.  I might would need to reverse the functions such that I do the time first, return the seconds, minutes etc in an array or object; and then say, array.forEach(el => if(el) document.createElement('span')) then add the innerHTML = `unit left${unit}` and then append to the parent container. Might need to pass the display fxn the cancel button as well if I were to reverse the fxns.  Some HTML will need to stay in an interval though to update every second.  I could just do something a touch hacky an make a big conditional to say if(remainderYears) {html with years} else if (days) {html with days down} and then always leave the hours and minutes and seconds

    //@# Update the display html:  note, a little hacky with big if statement, but works.

    if (remainderYears) {
      timeDisplay.innerHTML = `
	<span class="time-slot">Years left: ${remainderYears}</span>
  <span class="time-slot">Days left: ${days}</span>
  <span class="time-slot">Hours left: ${remainderHours}</span>
  <span class="time-slot">Minutes left: ${remainderMinutes}</span>
  <span class="time-slot">Seconds left: ${remainderSeconds}</span>
  `;
    } else if (days && !remainderYears) {
      timeDisplay.innerHTML = `
  <span class="time-slot">Days left: ${days}</span>
  <span class="time-slot">Hours left: ${remainderHours}</span>
  <span class="time-slot">Minutes left: ${remainderMinutes}</span>
  <span class="time-slot">Seconds left: ${remainderSeconds}</span>
  `;
    } else if (!days && !remainderYears) {
      timeDisplay.innerHTML = `
  <span class="time-slot">Hours left: ${remainderHours}</span>
  <span class="time-slot">Minutes left: ${remainderMinutes}</span>
  <span class="time-slot">Seconds left: ${remainderSeconds}</span>
  `;
    }
    //@@ stopping the interval if there is no time left
    if (
      [remainderSeconds, remainderMinutes, remainderHours, days].every(
        (unit) => unit <= 0 || !unit
      )
    ) {
      clearInterval(dateInterval);
      cancelBtn.textContent = "Time's up! Hooray!";
      cancelBtn.style.backgroundColor = '#3cc214';
      alert("Time's up!");
    }
  }, 1000);
  //@@ stopping the itnerval if the cancel button is clicked
  cancelBtn.dataset.interval = dateInterval;
  cancelBtn.addEventListener('click', () => {
    clearInterval(cancelBtn.dataset.interval);
    cancelBtn.parentElement.remove(); //!removes the parent event box;
  });
}

function convertTargetTime(targetTime) {
  //param is a string. Hence slicing for comparision
  let firstTwo = Number(targetTime.slice(0, 2));
  let lastThree = targetTime.slice(2);
  //   debugger;
  if (firstTwo > 12) {
    targetTime = `${firstTwo - 12}${lastThree}PM`;
  } else if (firstTwo == 12) {
    targetTime = `${firstTwo}${lastThree}PM`;
  } else if (firstTwo < 12 && firstTwo != 0) {
    targetTime = `${firstTwo}${lastThree}AM`;
  } else if (firstTwo == 0) {
    targetTime = `12${lastThree}AM`;
  } else {
    console.log('Somehting is wrong');
  }
  return targetTime;
}

addEventBtn.addEventListener('click', addTimer);
