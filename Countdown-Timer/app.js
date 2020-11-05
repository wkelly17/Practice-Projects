const addEventBtn = document.querySelector('.startBtn');
const eventNameInput = document.querySelector('#eventName');
console.log(eventNameInput);
const datePicker = document.querySelector('#datePicker');
const timePicker = document.querySelector('#timePicker');
//   const targetDate = document.querySelector('.your-date');
//   const targetDate2 = document.querySelector('.your-date2');
//   const timeLeftDisplay = document.querySelector('.time-left');
const eventsContainer = document.querySelector('.events-container');
//   let dateInterval;

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

  if (then - now <= 0) {
    alert('That already happened!');
  }

  let { lastDisplay, lastCancelBtn } = createEvent(
    targetDate,
    convertedTimeOfDay
  );
  console.log(lastDisplay, lastCancelBtn);
  debugger;
  updateTime(timeDifference, lastDisplay, lastCancelBtn);
}

function createEvent(targetDate, convertedTimeOfDay) {
  let event = document.createElement('div');
  event.classList.add('event');
  eventsContainer.appendChild(event);
  eventHeading = eventNameInput.value;
  event.innerHTML += `
  <h3 class="eventName">${eventHeading}</h3>
	  <p>Target Date:${targetDate}</p>
	  <p>Target Time:${convertedTimeOfDay}</p>
	  <div class="time-left">
		
	  </div>
	  <button class = "cancelBtn" data-interval = ""> cancel </button>
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

    //todo: I would like to know how to only show an element if it's not 0.  I guess i'd need to know time left whenver I create the display being passed in as a parameter.
    //? I wonder if i could store the interval id in a -dataset and cancel it with a button?

    timeDisplay.innerHTML = `
<span class="time-slot">Years left: ${remainderYears}</span>
  <span class="time-slot">Days left: ${days}</span>
  <span class="time-slot">Hours left: ${remainderHours}</span>
  <span class="time-slot">Minutes left: ${remainderMinutes}</span>
  <span class="time-slot">Seconds left: ${remainderSeconds}</span>
  
  `;
  }, 1000);
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
