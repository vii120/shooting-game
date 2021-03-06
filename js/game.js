var scoreBox = document.querySelector('.scoreBox');
var timeBox = document.querySelector('.timeBox');
var msgbox = document.querySelector('.msgBox');

var allHideout = document.querySelectorAll('.hideout');
var badguy = document.querySelectorAll('.badguy');
var friend = document.querySelectorAll('.friend');
var result = document.querySelector('.result');
var againBtn = document.querySelector('.again');
let inputBox = document.querySelector('.inputBox');

let lastHideout = '';
let gameOver = false;
let score = 0;
let topScore = 100;
let timeFn = null;
let timeCount = 0;

//start game!
gameStart();
againBtn.addEventListener('click', gameStart);

function gameStart(){
  gameOver = false;
  score = 0;
  timeCount = 0;
  msgbox.innerHTML = 'Game start!';
  upPerson();
  scoring();
  timer();
  result.style.display = 'none';
  inputBox.style.display = 'none';
}

//set popup character
function upPerson(){
  let hideoutID = upTime();
  let temp = Math.floor(Math.random()*10);
  let tempClass = temp>2? 'upBad' : 'upGood';
  hideoutID.classList.add(tempClass);
  // shooting reaction
  hideoutID.onclick = function(){
    if (Array.from(hideoutID.classList).includes('upBad')) shotBad(hideoutID);
    if (Array.from(hideoutID.classList).includes('upGood')) shotGood(hideoutID);
  }
  let time = Math.round(Math.random()*(1500-300)+300);
  setTimeout(function(){
    hideoutID.classList.remove(tempClass);
    if (!gameOver) upPerson();
  }, time);
}

//set popup time
function upTime(){
  let random = Math.floor(Math.random()*allHideout.length);
  if (random === lastHideout){
    return upTime()
  }
  lastHideout = random;
  return allHideout[random];
}

// shooting reaction: badguy
badguy.forEach(function(item){
  item.addEventListener('click', function(){
    shotBad(this.parentNode)
  })
})
function shotBad(hideout){
  msgbox.innerHTML = 'Yeah! You shoot the bag guy!';
  score += 10;
  hideout.classList.add('scoreAdd');
  setTimeout(function(){
    hideout.classList.remove('scoreAdd');
  }, 700);
  hideout.classList.remove('upBad');
  scoring();
}

// shooting reaction: friend
friend.forEach(function(item){
  item.addEventListener('click', function(){
    shotGood(this.parentNode)
  })
})
function shotGood(hideout){
  msgbox.innerHTML = 'Oops! You shoot the policenam!';
  score -= 10;
  hideout.classList.add('scoreMinus');
  setTimeout(function(){
    hideout.classList.remove('scoreMinus');
  }, 700);
  hideout.classList.remove('upGood');
  scoring();
}

//counting score
function scoring(){
  scoreBox.innerHTML = 
  `<span class="highlight">${score}</span> / ${topScore}`;
  if (score >= topScore || score < 0){
    gameover()
  }
}

//counting time
function timer(){
  if (timeFn == null){
    timeFn = setInterval(function(){
      timeCount++;
      let toSec = Math.floor(timeCount / 100);
      let ms = timeCount % 100;
      ms < 10 ?  ms = `0${ms}` : ms = ms ;
      timeBox.innerHTML = 
      `<span class="highlight">${toSec}</span>.<span class="ms">${ms}</span> sec` ;
    }, 10)
  }
}

//gameover
function gameover(){
  //stop popup
  gameOver = true;
  lastHideout = '';
  clearTimeout();
  //stop timer
  clearInterval(timeFn);
  timeFn = null;
  //show result
  result.style.display = 'flex';
  let win = score >= topScore ? true : false;
  let resultText = document.querySelector('.resultText');
  let resultImg = document.querySelector('.resultImg');
  resultText.innerHTML = win ? 'You win!' : 'You lose!';
  resultImg.src = win ? 'images/handcuffs.png' : 'images/thief.png';
  //winner's record
  if (win){
    addRec()
  }
}

//add winner's record
function addRec(){
  //get record
  let rawData = firebase.database().ref('/record/');
  rawData.once('value', function(snapshot){
    let val = snapshot.val();
    //convert records to array
    let data = [];
    for (let key in val){
      data.push(val[key].record)
    }
    data = data.sort(function (a, b) {
      return a > b ? 1 : -1;
    });
    //add record if it's in top 10
    let tenth = data[9];
    if (timeCount < tenth){
      let winnerName = inputBox.querySelector('.winnerName');
      let submit = inputBox.querySelector('.submit');
      inputBox.style.display = 'block';
      winnerName.value = '';
      submit.onclick = function(){
        if (winnerName.value.trim() !== ""){
          //add to database
          let timestamp = Math.floor(Date.now() / 1000);
          let newRec = {
            record: timeCount,
            timestamp: timestamp,
            name: winnerName.value.trim()
          }
          rawData.child(timestamp).set(newRec);
          //link to record page
          let tempLink = document.createElement('a');
          tempLink.href = "record.html";
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
        }
      }
      winnerName.onkeyup = function(e){
        if (e.keyCode === 13){
          submit.click()
        }
      }
    }
  })
}