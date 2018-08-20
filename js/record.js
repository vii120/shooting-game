var rawData = firebase.database().ref('/record/');

rawData.on('value', function(snapshot){
  var val = snapshot.val();
  //convert to array
  let data = [];
  for (let key in val){
    data.push(val[key])
  }
  getRec(data);
})

//sort database
function getRec(data){
  data = data.sort(function (a, b) {
    return a.record > b.record ? 1 : -1;
  });
  //print out
  printRec(data);
}

//print out top 10 record
function printRec(data){
  var ranks = document.querySelectorAll('.rank');
  var names = document.querySelectorAll('.name');
  var records = document.querySelectorAll('.record');
  let total = ranks.length;
  for (let i=0; i<total; i++){
    let toSec = Math.round(data[i].record / 100);
    let ms = data[i].record % 100;
    ranks[i].innerHTML = i+1;
    names[i].innerHTML = data[i].name;
    records[i].innerHTML = `${toSec}<span>.${ms}</span> sec`;
}
  //hightlight
  let hlNum ;
  if (screen.width < 768){
    hlNum = 3
  } else {
    hlNum = 4
  }
  var rows = document.querySelectorAll('.row');
  for (let i=0; i<hlNum; i++){
    rows[i].classList.add('highlight');
  }
}
