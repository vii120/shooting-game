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

startBtn.addEventListener('click', gameStart);
homeBtn.addEventListener('click', backtoHome);
homeBtn.style.display = 'none';

//start game!
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

//set gameboard layout
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

//set popup character
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

//set popup time
function randomUp(){
  let allHideout = document.querySelectorAll('.hideout');
  const random = Math.floor(Math.random()*allHideout.length);
  if (allHideout[random]===lastHideout){
    return randomUp()
  }
  lastHideout = allHideout[random].badguyID;
  return allHideout[random];
}

//shooting reaction
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

//counting score
let topScore = 100;
function scoring(){
  scoreBoard.innerHTML = `Score: <span>${score}</span> / ${topScore}`;
  if (score >= topScore || score < 0){
    gameover()
  }
}

//gameover
function gameover(){
  let msg = score>=topScore?'You win!':'You lose!';
  gameOver = true;
  startBtn.innerHTML = 'Again!';
  startBtn.style.display = 'block';
  homeBtn.style.display = 'block';
  clearTimeout();
  let result = document.createElement('div');
  let resultSpan = document.createElement('span');
  result.setAttribute('class', 'result');
  resultSpan.innerHTML = msg;
  let img = document.createElement('img');
  let imgSrc = score>=topScore?'images/handcuffs.png':'images/thief.png';
  img.setAttribute('src',imgSrc);
  result.appendChild(img);
  result.appendChild(resultSpan);
  gameBoard.appendChild(result);
}

//back to home
function backtoHome(){
  intro.style.display = 'block';
  startBtn.innerHTML = 'Start!';
  scoreBoard.innerHTML = '';
  msgbox.innerHTML = '';
  gameBoard.innerHTML = '';
  homeBtn.style.display = 'none';
}