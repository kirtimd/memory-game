

let cards = []; //will hold the list of cards
let firstFlipped = false; //tracks if the first card has been flipped
let noOfMatches = 0; //counter for no. of card matches
let noOfMoves = 0; //counter for no. of moves
let timer = {minutes:0, seconds:0};
let nextStar = 0; //tracks which star we are currently on


//array of images containing letters for the back of each card
let symbols =['img/ka.png', 'img/kha.png', 'img/ga.png', 'img/gha.png',
              'img/na.png', 'img/cha.png', 'img/chha.png', 'img/ja.png'];

let symbolIds = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7]; //unique identifier for each pair
                                                   //represents the array index for symbols[]
                                                   //will be randomized during initialization

initialize();
//add listeners to reset and play-again buttons
document.getElementById('reset').addEventListener('click', initialize);
document.getElementById('play-again').addEventListener('click', function() {
    initialize();
    //remove modal if player wants to play again
    hideModal();
});

//
//The code below contains implementations for all functions
//

//Initialize the cards and the side panel
function initialize() {
  cards = [];
  noOfMoves = 0;
  document.getElementsByClassName('move-counter')[0].innerHTML = noOfMoves;
  noOfMatches = 0;
  firstFlipped = false;
  timer.minutes=0; timer.seconds=0;
  resetStarRating();
  randomize();
  setupListeners();
  console.log(symbolIds);

}

function randomize() { //simply swaps each element with another one at a random index
  for(let i = 0; i < 16; i++) {
    let j = Math.floor(Math.random()*16); //Random number between 0 and 15

    //swap numbers
    let temp = symbolIds[i];
    symbolIds[i] = symbolIds[j];
    symbolIds[j] = temp;

  }
}

function setupListeners() {
  for(let i = 0; i <= 15; i++) { //note: cannot use for-each here as we're
                                 //pushing new items(objects) into the array
    const card = document.getElementById(i);
    card.className = 'front';
    cards.push({element: card,
                symbolId: symbolIds[i], 
                symbol: symbols[symbolIds[i]], //Devnagari letter (image)
                matched: false
              });
  }
  // add a single eventListener to the entire grid of 16 cards
  //useCapture set to false. Event will be handled in the bubbling phase.
  document.getElementById('grid').addEventListener('click', afterClick, false);
}


function afterClick(e) {
  if(e===null) return; //if the click was not on a card, return
  let card = e.target;
  if(cards[card.id].matched) return; //if this card has already been matched, return
  card.className = 'back';
  if(firstFlipped === false) {
    firstCard = cards[card.id];
    showSymbol(firstCard);
    firstFlipped = true;
  } else { //second card has been flipped
    let secondCard = cards[card.id];
    if(firstCard === secondCard) return; //if same card was clicked twice, return
    if(secondCard.matched === true) return;
    if(firstCard.symbolId === secondCard.symbolId) { //cards match
      console.log('match');
      secondCard.element.className = 'match';
      showSymbol(secondCard);
      firstCard.element.className = 'match';
      showSymbol(firstCard);

      firstCard.matched = true;
      secondCard.matched = true;

      cards[card.id].matched=true;
      firstCard = null;
      noOfMatches++;
    } else { //mismatch
      showSymbol(secondCard);
      card.className = 'mismatch';
      firstCard.element.className='mismatch';
      let card1 = firstCard.element; //pass a copy of the cards to the function below
      let card2 = card;
      setTimeout(function(){ //flip cards after 0.8sec
        card1.className='front';
        card2.className='front';

      }, 800, card1, card2);
      firstCard = null;
    }

    firstFlipped = false;

    //Now, make changes to the elements on the side panel:
    //1. increment moves-counter
    noOfMoves++;
    document.getElementsByClassName('move-counter')[0].innerHTML = noOfMoves;

    //2. change star rating after the 10th move
    if(noOfMoves > 10)
      setStarRating();

    //if all 8 pairs matched, game is finished
    if(noOfMatches === 8) {
      setTimeout(showModal, 500); //show modal after 0.5sec

    }
  }
}

//Show the card
function showSymbol(card) {
  card.element.style.backgroundImage = "url('" + card.symbol +"')";
}

//Timer
let zeroBeforeMin, zeroBeforeSec;
const timerFunc = setInterval(function(){
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
}, 1000); //repeat function after every 1sec


//Star rating
//After the 10th move, star rating reduces(by half) after every 5 moves
function setStarRating() {
  if(nextStar <= 2)
  if(noOfMoves%10==0){ // change to half star on the 10th, 20th, 30th,... move
    document.getElementById("star-rating-"+nextStar).innerHTML = "star_half";
  }
  else if (noOfMoves%10==5) { // change to border star on 15th, 25th, 35th,... move
    document.getElementById("star-rating-"+nextStar).innerHTML = "star_border";
    nextStar++;
  }
}

//reset all the stars that have been set to half or star_border
//and set nextStar to 0, so that we start at the right-most star for next game
function resetStarRating() {
  while(--nextStar >= 0) {
    console.log("nextStar: "+nextStar);
    document.getElementById("star-rating-"+nextStar).innerHTML = "star";
  }
  // document.getElementById(starClassName+"0").innerHTML = "star";
  // document.getElementById(starClassName+"0").innerHTML = "star";
}


//Show results are completing game
function showModal() {
  clearInterval(timerFunc);
  console.log('here');
  //hide grid
  document.getElementById('grid').style.display = 'none';
  //replace 'reset' button with 'play again'
  document.getElementById('reset').style.display = 'none';
  document.getElementById('play-again').style.display = 'block';

}

//Hide modal if player decides to play again
function hideModal() {
  document.getElementById('grid').style.display = 'flex';
  document.getElementById('reset').style.display = 'block';
  document.getElementById('play-again').style.display = 'none';
}
