var intro = document.querySelector('.intro');
var startBtn = document.querySelector('.start');
var homeBtn = document.querySelector('.tohome');
var scoreBoard = document.querySelector('.scoreBoard');
var gameBoard = document.querySelector('.gameBoard');
var msgbox = document.querySelector('.msgBox');

let lastHideout = '';
let gameOver = false;
let score;
let hideoutNum = 9;

//start game!
startBtn.addEventListener('click', gameStart);
homeBtn.addEventListener('click', backtoHome);
homeBtn.style.display = 'none';

function gameStart(){
  gameOver = false;
  startBtn.style.display = 'none';
  homeBtn.style.display = 'none';
  intro.style.display = 'none';
  msgbox.innerHTML = 'Game start!';
  setGameboard();
  startPopup();
  score = 0;
  scoring();
}

//set game board
function setGameboard(){
  gameBoard.innerHTML = '';
  for (let i=0; i<hideoutNum; i++){
    let div = document.createElement('div');
    div.setAttribute('class', 'hideout');
    div.badguyID = i;
    let badguy = document.createElement('div');
    badguy.setAttribute('class', 'badguy');
    badguy.onclick = shotBadguy;
    div.appendChild(badguy);
    let friend = document.createElement('div');
    friend.setAttribute('class', 'friend');
    friend.onclick = shotFriend;
    div.appendChild(friend);
    let bricks = document.createElement('div');
    bricks.setAttribute('class', 'bricks');
    div.appendChild(bricks);
    gameBoard.appendChild(div);
  }
}

function startPopup(){
  let hideoutID = randomUp();
  let temp = Math.floor(Math.random()*10);
  let tempClass = temp>2? 'upBad' : 'upGood';
  hideoutID.classList.add(tempClass);
  let time = Math.round(Math.random()*(1500-250)+250);
  setTimeout(function(){
    hideoutID.classList.remove(tempClass);
    if (!gameOver) startPopup();
  }, time);
}

function randomUp(){
  let allHideout = document.querySelectorAll('.hideout');
  const random = Math.floor(Math.random()*allHideout.length);
  if (allHideout[random]===lastHideout){
    return randomUp()
  }
  lastHideout = allHideout[random].badguyID;
  return allHideout[random];
}

//shooting function
function shotBadguy(){
  msgbox.innerHTML = 'Yeah! You shoot the bag guy!';
  score += 10;
  this.parentNode.classList.add('scoreAdd');
  const vm = this;
  setTimeout(function(){
    vm.parentNode.classList.remove('scoreAdd');
  }, 700);
  this.parentNode.classList.remove('upBad');
  scoring();
}
function shotFriend(){
  msgbox.innerHTML = 'Oops! You shoot the policenam!';
  score -= 10;
  this.parentNode.classList.add('scoreMinus');
  const vm = this;
  setTimeout(function(){
    vm.parentNode.classList.remove('scoreMinus');
  }, 700);
  this.parentNode.classList.remove('upGood');
  scoring();
}

function scoring(){
  scoreBoard.innerHTML = `Score: ${score}`;
  let topScore = 100;
  let msg = score>=topScore?'You win!':'You lose!';
  if (score >= topScore || score < 0){
    gameOver = true;
    startBtn.style.display = 'block';
    startBtn.innerHTML = 'Again!';
    clearTimeout();
    let div = document.createElement('div');
    let span = document.createElement('span');
    div.setAttribute('class', 'result');
    span.innerHTML = msg;
    let img = document.createElement('img');
    let imgSrc = score>=topScore?'images/handcuffs.png':'images/thief.png';
    img.setAttribute('src',imgSrc);
    span.insertAdjacentElement('afterbegin', img);
    div.appendChild(span);
    gameBoard.appendChild(div);
    homeBtn.style.display = 'block';
  }
}

function backtoHome(){
  gameBoard.innerHTML = '';
  startBtn.innerHTML = 'Start!';
  scoreBoard.innerHTML = '';
  msgbox.innerHTML = '';
  intro.style.display = 'block';
  homeBtn.style.display = 'none';
}