
let firstFlipped = false;
let noOfMatchesYet = 0;
let noOfMoves = 0;
let timer = {minutes:0, seconds:0};
let cards = [];


//array of urls to symbolIds
let symbols =["img/ka.png", "img/kha.png",
              "img/ga.png", "img/gha.png",
              "img/na.png", "img/cha.png",
              "img/chha.png", "img/ja.png"];

let symbolIds = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
//each number appears twice since we need a pair

initialize();

document.getElementById('reset').addEventListener('click', initialize);

function initialize() { //also called during reset
  console.log('init');
  noOfMoves = 0;
  document.getElementsByClassName('move-counter')[0].innerHTML = noOfMoves;
  noOfMatchesYet = 0;
  timer.minutes=0; timer.seconds=0;
  setupListeners();
  //randomize();
  assignSymbolIds();
}
//simply swaps each element with one at a random index
function randomize() {
  for(let i = 0; i < 16; i++) {
    let j = Math.floor(Math.random()*16);

    //swap
    let temp = symbolIds[i];
    symbolIds[i] = symbolIds[j];
    symbolIds[j] = temp;

  }
}



function assignSymbolIds() {
  for(let i=0; i <= 15; i++) {
    cards[i].symbolId = symbolIds[i];
  }
}

function setupListeners() {
  for(let i=0; i <= 15; i++) {
    const card = document.getElementById(i);
    card.className = 'front';
    card.addEventListener('click', afterClick);
    cards.push({element: card,
                symbolId: symbolIds[i%8],
                symbol: symbols[symbolIds[i]]});
  }

}

let firstCard;

function afterClick() {
  this.className = 'back';
  if(firstFlipped === false) {
    firstCard = cards[this.id];
    console.log("url('" + firstCard.symbol +"')");
    showSymbol(firstCard);
    firstFlipped = true;
  } else { //second card has been flipped
    let secondCard = cards[this.id];
    if(cardsMatch(firstCard, secondCard) === true) { //cards match
      console.log('match');
      secondCard.element.className = 'match';
      showSymbol(secondCard);
      firstCard.element.className = 'match';
      showSymbol(firstCard);

      //remove eventlisteners
      secondCard.element.removeEventListener('click', afterClick);
      firstCard.element.removeEventListener('click', afterClick);

      firstCard = null;
      noOfMatchesYet++;
    } else { //mismatch
      showSymbol(secondCard);
      this.className = 'mismatch';
      firstCard.element.className='mismatch';
      let card1 = this; //pass this element to the function
      setTimeout(function(){
        card1.className='front';
        firstCard.element.className='front';
        firstCard = null;
      }, 800, card1, firstCard);

    }
    firstFlipped = false;

    //Now make changes to elements on side panel

    //increment moves-counter
    noOfMoves++;
    document.getElementsByClassName('move-counter')[0].innerHTML = noOfMoves;
    if(noOfMatchesYet == 8) { //game over
      document.getElementsByClassName('game-status')[0].innerHTML = "Success!";
    }

    if(noOfMoves >= 10)
      setStarRating();
  }
}

function showSymbol(card) {
  card.element.style.backgroundImage
      = "url('" + card.symbol +"')";
}

function cardsMatch(firstCard, secondCard) {
  if(firstCard.symbolId === secondCard.symbolId)
    return true;
  return false;
}


let zeroBeforeMin, zeroBeforeSec;
setInterval(function(){
  if(timer.minutes < 10) zeroBeforeMin = "0";
  else zeroBeforeMin = "";
  if(timer.seconds < 10) zeroBeforeSec = "0";
  else zeroBeforeSec = "";
  document.getElementById('timer').innerHTML = zeroBeforeMin + timer.minutes +
                                           ":" + zeroBeforeSec + timer.seconds;
  timer.seconds++;
  if(timer.seconds==60) {
    timer.minutes++;
    timer.seconds=0;
  }
}, 1000);


let starClassName = "star-rating-";
let nextStar = 0;
function setStarRating() {
  if(nextStar <= 2)
  if(noOfMoves%10==0){
    document.getElementById(starClassName+nextStar).innerHTML = "star_half";
  }
  else if (noOfMoves%10==5) {
    document.getElementById(starClassName+nextStar).innerHTML = "star_border";
    nextStar++;
  }
}
