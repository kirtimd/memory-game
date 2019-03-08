
let firstFlipped = false;
let noOfMatchesYet = 0;
let cards = [];


//array of urls to symbolIds
let symbols =["img/ka.png", "img/kha.png",
              "img/ga.png", "img/gha.png",
              "img/na.png", "img/cha.png",
              "img/chha.png", "img/ja.png"];

let symbolIds = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
//each number appears twice since we need a pair

setupListeners();
//randomize();
assignSymbolIds();

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
    card.addEventListener('click', afterClick);
    cards.push({element: card,
                symbolId: symbolIds[i%8],
                symbol: symbols[symbolIds[i]]});
    // console.log(cards[i].symbol);
  }
}

let firstCard;

function afterClick() {
  // this.style.backgroundColor='blue';
  this.className = 'back';
  if(firstFlipped === false) {
    firstCard = cards[this.id];
    console.log("url('" + firstCard.symbol +"')");
    showSymbol(firstCard);
    firstFlipped = true;
  } else { //second card has been flipped
    let secondCard = cards[this.id];
    if(cardsMatch(firstCard, secondCard) === true) {
      console.log('match');
      secondCard.element.className = 'match';
      showSymbol(secondCard);
      firstCard.element.className = 'match';
      showSymbol(firstCard);
      firstCard = null;
    } else {
      showSymbol(secondCard);
      this.className = 'mismatch';
      firstCard.element.className='mismatch';
      let card1 = this; //pass this element to the function
      setTimeout(function(){
        card1.className='front';
        firstCard.element.className='front';
        firstCard = null;
      }, 1000, card1, firstCard);

    }
    firstFlipped = false;

    if(noOfMatchesYet == 8) { //game over

    }
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
