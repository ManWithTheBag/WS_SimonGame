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
var bodyHtml = $(document.getElementById("js-body"));

function ButtonObj(number, color, audio) {
  this.number = number;
  this.color = color;
  this.buttonHtml = null;
  this.createClickEvent = function(buttonObj) {
    this.buttonHtml.on("click", function() {
      if(isPlayingButton === false && isPlayingRound === true){
        onButtonClick(buttonObj);}
    })}
}


//Prepared section

createButtons();
addClickEvents();

function createButtons() {
  var buttonGreen = new ButtonObj(0, "green");
  buttonsObjArray.push(buttonGreen);

  var buttonRed = new ButtonObj(1, "red");
  buttonsObjArray.push(buttonRed);

  var buttonYellow = new ButtonObj(2, "yellow");
  buttonsObjArray.push(buttonYellow);

  var buttonBlue = new ButtonObj(3, "blue");
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

// Game section

function onButtonClick(buttonObj) {
  buttonAnimation(buttonObj.buttonHtml);
  playSound(buttonObj.color);

  inputOrderArray.push(buttonObj);

  compareArrays();
}

function updateLevelText(){
  $(levelHtml).text("level " + randomOrderArray.length)
}

$(document).on("keypress", function(event) {
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
      playSound(randomOrderArray[i].color);

      await sleep(timeDelayPlayButton);
    }
    console.log("done");
    inputOrderArray = [];
    isPlayingButton = false;
  })();
}

function compareArrays(){
  var result = true;

  for (var i = 0; i < inputOrderArray.length; i++) {
  if(inputOrderArray[i].number != randomOrderArray[i].number){
    result = false;}}

  if(result === true){
    goodAnswer();}
  else{
    wrongAnswer();}
}

function playSound(name){
  var audio = new Audio("/WS_SimonGame/Sound/" + name + ".mp3");
  audio.play();
}

function goodAnswer(){
  if(inputOrderArray.length === randomOrderArray.length){
    setTimeout(addToRandomOrderArray, timeDelayChangeRound)
  }
}
function wrongAnswer(){
  bodyHtml.addClass("js_body-game-over");
  setTimeout(function(){bodyHtml.removeClass("js_body-game-over")}, timeGameOverScreen)
  playSound("wrong");
  inputOrderArray = [];
  randomOrderArray = [];
  isPlayingRound = false;
  $(levelHtml).text("Press A for start");
}
