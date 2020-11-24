const answerSlots = [...document.querySelectorAll('.answerChoice')];
const currentQuestion = document.querySelector('.currentQuestion');
const startBtn = document.querySelector('.startBtn');
let questions = ''; //? Would love for this to not be global, (I mean, it could be within in its own class or object generator;  But at least I closed over the api array index )
//todo: brain not working: 1. I want to call the api once and store those 10 or however many questions in once spot.  I then want to access each of those 10 questions incrementing an index to move through teh array of objects display on each progress through game;
let numberCorrect = 0;
let timeToFinish = 0;

///-: done closing over async = not easy or not fun;  refactor to class, and make questions a class property;
//todo: ending game; better styling;  Correct answer listening; categories. custom api call;

async function progressGame() {
  // console.log(this);
  //   debugger;
  if (startBtn.dataset.action == 'start') {
    let apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';
    let response = await fetch(apiUrl);
    let questionsData = await response.json();
    questionsData = questionsData.results;
    questions = questionsData;
    startBtn.dataset.action = 'next';
    startBtn.innerText = 'next';
    displayQuestions(questions);
    intervalId();
    return questions;
  } else {
    clearClasses();
    displayQuestions(questions);
  }
}
// progressGame();  //If desired to load game on page load

function clearClasses() {
  answerSlots.forEach((slot) => {
    slot.parentElement.classList.remove('correct', 'incorrect');
  });
}
// function displayQuestions2(){
// 	let questionsIdx = 0;
// 	let questions = await getQuestions()

// }

function display(questions) {
  //   debugger;
  console.log(questions);
  let questionsIdx = 0;
  //done  how to close over index? Don't want to globalize it too : )
  return function (questions) {
    question = questions[questionsIdx];

    if (questionsIdx >= questions.length) {
      return endGame();
    }
    currentQuestion.innerHTML = question.question;

    let wrongChoices = question.incorrect_answers;
    console.log(question.correct_answer, 'Correct Answer');
    // console.log(wrongChoices);
    let options = [...wrongChoices, question.correct_answer];
    console.log(options);

    for (let i = 0; i < answerSlots.length; i++) {
      let random = getRandomInt(options.length);
      answerSlots[i].innerHTML = options[random];
      answerSlots[i].dataset.value = options[random];
      options.splice(random, 1);
    }

    checkForCorrect(event, question);
    startBtn.style.display = 'none'; //prevent skipping q's
    return ++questionsIdx;
  };
}
let displayQuestions = display();

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function checkForCorrect(event, question) {
  const choicesContainer = document.querySelector('.quizChoices');
  choicesContainer.addEventListener(
    'click',
    function checking(event) {
      if (!event.target.classList.contains('answerChoice')) {
        return checkForCorrect(event, question); //! I switched to a single event listener on the container here bc I was having trouble incrementing the score when attaching event listeners to each answer choice; It would increment by multiples bc the looping through array;  If the person accidentally clicks a non-answer choice, it just reruns checking correct while passing through event and question;
      }
      if (event.target.dataset.value == question.correct_answer) {
        console.dir(event.target);
        ++numberCorrect;
        event.target.parentElement.classList.add('correct');
      } else {
        event.target.parentElement.classList.add('incorrect');
        let correct = answerSlots.find(
          (answer) => answer.dataset.value == question.correct_answer
        );
        correct.parentElement.classList.add('correct');
      }
      startBtn.style.display = 'block'; //prevent skipping q's
    },
    { once: true }
  );
}

function endGame(event) {
  clearInterval(intervalId);
  const endGameDisplay = document.querySelector('.endGameMessage');
  endGameDisplay.innerText = `Game over.  You got ${numberCorrect} out of 10 correct;   It took you ${timeToFinish} seconds to finish `;
  document
    .querySelector('.quizChoices')
    .removeEventListener('click', checkForCorrect);
}

let intervalId = function startTimer() {
  setInterval(() => {
    timeToFinish++;
  }, 1000);
};

// displayQuestions();
// console.log(displayQuestions());

startBtn.addEventListener('click', progressGame);

//Don't love this piece of work: For one, I have to hide the next button in order to keep from the checking for correct function from being broken; Two, atm, the api is fixed.   I wish I could skip without toggling button on and off; I don't really love the amount of globals, adn I don't like the coupling of api call vs displaying questions in same progress function;
