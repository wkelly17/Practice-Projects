// ! Christmas lights from Florin Pop  Started on: Thursday October 29, 2020 01:54PM idea https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Christmas-Lights-App.md
const colors = ['red', 'orange', 'blue', 'green', 'yellow', 'cyan'];

const shadows = [
  '#fc6f65',
  '#f5a658',
  '#8cfaf3',
  '#a0fc8b',
  '#f5e97f',
  '#acfcfa',
];

//@@ =============== DOM ELEMENTS  =============
const startBtn = document.querySelector('.start');
const stopBtn = document.querySelector('.stop');
const startBtn1 = document.querySelector('.start1');
const stopBtn2 = document.querySelector('.stop2');
const bulbs = Array.from(document.querySelectorAll('.grouped-bulbs')); //wanted array from these so that I could use filter function
const sequentialBulbs = Array.from(document.querySelectorAll('.sequential'));
const evenBulbs = bulbs.filter((bulb) => bulbs.indexOf(bulb) % 2 == 0);
const oddBulbs = bulbs.filter((bulb) => bulbs.indexOf(bulb) % 2 != 0);
console.log({ evenBulbs }, { oddBulbs });

//@@ ---------- MULTIPLE BULBS FLASHING --------- */

function triggerBulbs(bulbset, startingIndex, onSpeed, offSpeed) {
  //@% I had this as a seperate fxn caues I thought I needed the index interval here, but it actually does work in the flash fxn, but I don't feel like refactoring the flash fxn right now to make it have the forEach bulbset.
  bulbset.forEach((bulb) => flash(bulb, startingIndex, onSpeed, offSpeed));
}

function flash(bulb, index, onSpeed, offSpeed) {
  let start = setInterval(() => {
    // debugger;
    document.documentElement.style.setProperty(
      `--bulb-color`,
      `${colors[index]}`
    );
    document.documentElement.style.setProperty(
      `--bulb-shadow`,
      `${shadows[index]}`
    );

    bulb.classList.add('lit');
  }, onSpeed);

  let stop = setInterval(() => {
    bulb.classList.remove('lit');
  }, offSpeed);

  let counter = setInterval(() => {
    if (index >= colors.length - 1) {
      //   debugger;
      index = 0;
    } else index++;
  }, offSpeed);

  //Stop the blinking
  function stopLights() {
    clearInterval(start);
    clearInterval(stop);
    clearInterval(counter);
    bulb.classList.remove('lit');
  }
  stopBtn.addEventListener('click', stopLights);
}

//@@ --- SEQUENTIAL 1 AT TIME BULBS FLASHING --- */

function sequential(timer) {
  let colorsIndex = 0; //to avoid conflating the bulbs and the colors indices
  console.log(colorsIndex);
  //   debugger;
  sequentialBulbs.forEach(function (bulb, index) {
    //@% light the bulbs
    let brighten = setTimeout(
      (index) => {
        document.documentElement.style.setProperty(
          `--bulb-color`,
          `${colors[colorsIndex]}`
        );
        document.documentElement.style.setProperty(
          `--bulb-shadow`,
          `${shadows[colorsIndex]}`
        );
        console.log('lighting bulb');
        bulb.classList.add('lit');
      },
      timer * index,
      index
    );

    //@% dim the bulbs
    let dim = setTimeout(
      (index) => {
        console.log(index);
        console.log('dimming bulb');
        bulb.classList.remove('lit');

        //@% check index of bulbs against colors length
        if (colorsIndex >= colors.length - 1) {
          //   debugger;
          colorsIndex = 0;
        } else colorsIndex++;
        console.log(colorsIndex);
      },
      timer * index + timer,
      index
    );

    function stopLights() {
      console.log('stopping');
      clearTimeout(brighten);
      clearTimeout(dim);
      sequentialBulbs.forEach((bulb) => bulb.classList.remove('lit'));
    }
    stopBtn2.addEventListener('click', stopLights);
  });
}

//=========================================
//@@====      EVENT LISTENERS          ====
//========================================
startBtn.addEventListener('click', () => {
  triggerBulbs(evenBulbs, 0, 500, 2500);
  triggerBulbs(oddBulbs, 2, 900, 3800);
});

startBtn1.addEventListener('click', () => {
  sequential(1000);
});
