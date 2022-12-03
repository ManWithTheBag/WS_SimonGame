var buttonsObjArray = [];
var randomOrderArray = [];
var inputOrderArray = [];
var timeGameOverScreen = 500; // ms
var timeAnimationClick = 300; // ms
var timeDelayPlayButton = 1000; // ms
var timeDelayChangeRound = 1500; // ms
var isPlayingButton = false;
var isPlayingRound = false;
var levelHtml = $(".js_title-level")[0];
var greenAudio = new Audio("D:\WebDev_Learning/WS_SimonGame/Sound/green.mp3");
var redAudio = new Audio("D:\WebDev_Learning/WS_SimonGame/Sound/red.mp3");
var yellowAudio = new Audio("D:\WebDev_Learning/WS_SimonGame/Sound/yellow.mp3");
var blueAudio = new Audio("D:\WebDev_Learning/WS_SimonGame/Sound/blue.mp3")
var wrongAnswerAudio = new Audio("D:/WebDev_Learning/WS_SimonGame/Sound/wrong.mp3");
var bodyHtml = $(document.getElementById("js-body"));

function ButtonObj(number, color, audio) {
  this.number = number;
  this.color = color;
  this.audio = audio;
  this.buttonHtml = null;
  this.createClickEvent = function(buttonObj) {
    this.buttonHtml.on("click", function() {
      if(isPlayingButton === false && isPlayingRound === true){
        onButtonClick(buttonObj);
      }
    })
  }
}


//Prepared section

createButtons();
addClickEvents();

function createButtons() {
  var buttonGreen = new ButtonObj(0, "green", greenAudio);
  buttonsObjArray.push(buttonGreen);

  var buttonRed = new ButtonObj(1, "red", redAudio);
  buttonsObjArray.push(buttonRed);

  var buttonYellow = new ButtonObj(2, "yellow", yellowAudio);
  buttonsObjArray.push(buttonYellow);

  var buttonBlue = new ButtonObj(3, "blue", blueAudio);
  buttonsObjArray.push(buttonBlue);
}

function addClickEvents() {
  buttonsObjArray.forEach((item) => {
    item.buttonHtml = getButtonHtml(item.color);
    item.createClickEvent(item);
  });
}

function getButtonHtml(color) {
  domElement = document.getElementById("js_button-" + color);
  return $(domElement);
}

function buttonAnimation(buttonHtml) {
  buttonHtml.fadeOut(timeAnimationClick / 2).fadeIn(timeAnimationClick  / 2);
  buttonHtml.addClass("js_button-animation-pressed");
  setTimeout(function(){buttonHtml.removeClass("js_button-animation-pressed"), timeAnimationClick})
}

function playButtonAudio(audio){
  audio.play();
}


// Game section

function onButtonClick(buttonObj) {
  buttonAnimation(buttonObj.buttonHtml);
  playButtonAudio(buttonObj.audio);

  inputOrderArray.push(buttonObj);

  if(compareArrays() === true){
    goodAnswer();}
  else{
    wrongAnswer();}
}

function updateLevelText(){
  if(randomOrderArray.length === 0){
    $(levelHtml).text("level " + 1)
  }
  else{
    $(levelHtml).text("level " + randomOrderArray.length)
  }
}

$(document).on("keypress", function(event) {
  // debugger;
  if (event.key === "a" && isPlayingRound === false) {
    isPlayingRound = true;
    addToRandomOrderArray()
  }
})

function addToRandomOrderArray() {
  if (isPlayingButton === false) {
    isPlayingButton = true;
    randomOrderArray.push(buttonsObjArray[getRandomNumber()])
    updateLevelText();
    playRandomOrderAnimation(randomOrderArray)
  }
}

function getRandomNumber() {
  return Math.floor(Math.random() * 4);
}

function playRandomOrderAnimation(randomOrderArray) {

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  (async () => {
    for (let i = 0; i < randomOrderArray.length; i++) {

      buttonAnimation(randomOrderArray[i].buttonHtml);
      playButtonAudio(randomOrderArray[i].audio);

      await sleep(timeDelayPlayButton);
    }
    console.log("done");
    inputOrderArray = [];
    isPlayingButton = false;
  })();
}

function compareArrays(){
  for (var i = 0; i < inputOrderArray.length; i++) {
    console.log( "Input:  " + inputOrderArray[i].number);
    console.log( "Random:  " + randomOrderArray[i].number);
  }
   var result = true;

  for (var i = 0; i < inputOrderArray.length; i++) {

  if(inputOrderArray[i].number != randomOrderArray[i].number){
    result = false;
  }}

  return result;
}

function goodAnswer(){
  if(inputOrderArray.length === randomOrderArray.length){
    setTimeout(addToRandomOrderArray, timeDelayChangeRound)
  }
}
function wrongAnswer(){
  bodyHtml.addClass("js_body-game-over");
  setTimeout(function(){bodyHtml.removeClass("js_body-game-over")}, timeGameOverScreen)
  wrongAnswerAudio.play();
  inputOrderArray = [];
  randomOrderArray = [];
  isPlayingRound = false;
    $(levelHtml).text("Press A for start");
}
