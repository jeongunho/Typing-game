"use strict";

/*
const show = () => {
  Toastify({
    text: "This is a toast",
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function(){} // Callback after click
  }).showToast();
}
*/

const url = "http://random-word-api.herokuapp.com/word?number=500";
const settingTime = 5;
let words = [];
let time;
let score = 0;
let isReady = false;
let isPlaying = false;
let timeInterval;

const wrapper = document.querySelector(".wrapper");
const word = document.querySelector(".word-display");
const wordInput = document.querySelector(".word-input");
const timeDisplay = document.querySelector(".time");
const scoreDisplay = document.querySelector(".score");
const button = document.querySelector(".button");
const result = document.querySelector(".result");
const myscore = document.querySelector(".myscore");
const again = document.querySelector(".again");

time = 5;

// Function
const runToast = text => {
  const option = {
    text: text,
    duration: 3000,
    newWindow: true,
    gravity: "top",
    position: "right",
    background: "linear-gradient(0deg, #04fafd, 5%, #119dff, 50%, #3a3e69)",
  };
  Toastify(option).showToast();
};

const getWords = () => {
  axios
    .get(url)
    .then(response => {
      words = response.data.filter(word => {
        return word.length < 8;
      });
      button.textContent = "게임 시작";
      button.classList.remove("loading");
      isReady = true;
    })
    .catch(error => console.log(error));
};

button.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  word.textContent = words[randomIndex];
  button.style.opacity = 0;
  button.style.pointerEvents = "none";
});

const init = () => {
  time = settingTime;
  getWords();
};

const countDown = () => {
  if (time > 0) {
    time--;
  } else {
    clearInterval(timeInterval);
    isPlaying = false;
    result.classList.add("visible");
    myscore.textContent = score;
    button.style.opacity = 1;
  }
  timeDisplay.textContent = time;
};

const run = () => {
  clearInterval(timeInterval);
  if (isReady === false) {
    return;
  }
  timeInterval = setInterval(countDown, 1000);
  wordInput.value = "";
  score = 0;
  time = settingTime;
  scoreDisplay.textContent = score;
  isPlaying = true;
};

const checkMatch = param => {
  const myTyping = param.currentTarget.value.toLowerCase();
  let wordDisplay = word.innerText.toLowerCase();

  if (param.keyCode === 13) {
    if (!isPlaying) {
      return;
    }
    if (myTyping === wordDisplay) {
      score++;
      runToast(wordDisplay);
      time = settingTime;
      wordInput.value = "";
      const randomIndex = Math.floor(Math.random() * words.length);
      word.textContent = words[randomIndex];
    }
  }
  scoreDisplay.textContent = score;
};

again.addEventListener("click", e => {
  result.classList.remove("visible");
  scoreDisplay.textContent = 0;
  button.style.pointerEvents = "initial";
});

// Event handler
wordInput.addEventListener("keydown", checkMatch);

// Getting ready
init();