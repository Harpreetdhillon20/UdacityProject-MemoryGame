/* global variable declaration start */
let elemOpened = [];
let matchedCards = [];
let timer = document.querySelector('.restart .stopWatch');
let minutes = 00;
let seconds = 00;
let min = 1;
let sec = 0;
let moveCounter = 0;
const reset = document.querySelector('.fa-repeat');
const unorderedList = document.getElementById('deckList');
let icons = document.getElementById('deckList').getElementsByClassName('fa');
let cardList = [];
let elem = null;

/* global variable declaration end */

reset.addEventListener('click', resetGame); /* to reset game board */

/* code to call shuffle with an array */
for (let i = 0; i < icons.length; i++) {
    const classes = icons[i].classList;
    for (let j = 0; j < classes.length; j++) {
        const classAtIndex = classes[j];
        if (classAtIndex !== 'fa') {

            cardList.push(classAtIndex);

        }

    }
}
const shuffledarray = shuffle(cardList); /* calling shuffle */
for (let i = 0; i < shuffledarray.length; i++) {
    let oldChild = icons[i];
    icons[i].className = `fa ${shuffledarray[i]}`;
    console.log(icons[i].classList);
    const liChilds = unorderedList.children;
    liChilds[i].replaceChild(icons[i], oldChild);
}
/* shuffle completed */

/*  event handler to process a click on card */
unorderedList.addEventListener('click', function (e) {

    elem = e.target;
    if (elem.nodeName === 'LI') {
        if (elem.classList.contains('match') || elem.classList.contains('open') || elemOpened.length === 2) {

            /* have to do nothing as card exists as a matched card or an open card. It also disables click if list of opened cards has 2 elements */

        }
        else {

            /* to process match and to open a card */
            elem.classList.add('open');
            elem.classList.add('show');
            listOfOpenCards(elem);

        }
    }
});
/* end of event handler for click on a card */

/* shuufles cards */
function shuffle(array) {

    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* shuffling ends */

/* function to maintain a list of cards currently open and calls function to compare two open cards */

function listOfOpenCards(elem) {

    const openCard = [elem];

    elemOpened = elemOpened.concat(openCard);

    if (elemOpened.length > 1) {

        compareOpenCards(elemOpened);

    }

}
/* open card adding to list and comparison done */

/* compares two open cards calls function to process a match and a mismatch*/
function compareOpenCards(openCards) {

    const firstCard = openCards[0];
    const secondCard = openCards[1];
    const openCardClasses = firstCard.firstElementChild.classList;
    let count = 0;
    for (let i = 0; i < openCardClasses.length; i++) {
        const classAtIndex = openCardClasses[i];
        if (secondCard.firstElementChild.classList.contains(classAtIndex)) {

            count++;
        }
        else {

            firstCard.classList.add('mismatch');
            firstCard.classList.remove('show');
            secondCard.classList.add('mismatch');
            secondCard.classList.remove('show');
            /* timeout set so that cards are not closed immediately */
            setTimeout(hideCards, 1000, firstCard, secondCard);

        }
    }
    if (count === openCardClasses.length) {

        lockCardsinOpenPositon(firstCard, secondCard);

    }

}
/* comparison ends */

/* locks two matched cards in open positions, adds all matched cards to a list.
Also empties opened element list.
Calls function to increment moves.
Checks if game has been won. */
function lockCardsinOpenPositon(firstCard, secondCard) {

    firstCard.classList.add('match');
    secondCard.classList.add('match');
    firstCard.classList.remove('open', 'show');
    secondCard.classList.remove('open', 'show');
    matchedCards = matchedCards.concat(elemOpened);
    elemOpened = [];
    incrementMoves();
    if (matchedCards.length === unorderedList.getElementsByTagName('li').length) {

        gameWon();

    }

}
/* end of locking cards */

/* function to display winning modal */
function gameWon() {

    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
    const winText = document.querySelector('.starCount');
    const oldText = winText.innerHTML;
    const stars = document.querySelectorAll('.stars .fa-star');
    console.log('stars ' + stars);
    const noOfStarsLeft = stars.length;
    console.log('noOfStarsLeft ' + noOfStarsLeft);
    if (minutes === 0) {

        winText.innerHTML = `With ${noOfStarsLeft} ${oldText} in ${moveCounter} moves.</br> Won in ${seconds} seconds.`;

    }
    else {

        winText.innerHTML = `With ${noOfStarsLeft} ${oldText} in ${moveCounter} moves.</br> Won in ${minutes} minutes and ${seconds} seconds.`;

    }
    /* event listener added to button in modal to reset the game */
    const resetButton = document.querySelector('.reset');
    resetButton.addEventListener('click', function restartGame() {
        winText.innerHTML = `${oldText}`;
        modal.style.display = 'none';
        resetGame();
    })

}
/* game won function ends */

/* logic to close cards in case of a mismatch.
Also increases moves by calling increment moves function.
*/
function hideCards(firstCard, secondCard) {

    firstCard.classList.remove('open', 'mismatch');
    secondCard.classList.remove('open', 'mismatch');
    elemOpened = [];
    incrementMoves();

}
/* hide cards ends */

/* incrementTimer to keep count of time, being called every second */
setTimeout(incrementTimer, 1000);

function incrementTimer() {

    sec++;
    if (sec <= 9) {

        seconds = `0${sec}`;

    }
    else {

        seconds = sec;

    }
    if (seconds === 60) {

        sec = 0;
        seconds = `0${sec}`;

        if (min < 9) {

            minutes = `0${min++}`;

        }

        else {

            minutes = min++;

        }

    }
    if (min === 1) {

        minutes = `00`;

    }
    timer.textContent = `${minutes}:${seconds}`;
    setTimeout(incrementTimer, 1000);

}
/* increment timer ends */

/* incrementMoves handles star count and moves */
function incrementMoves() {

    const numMoves = document.getElementsByClassName('moves');
    console.log("MoveCounter:: " + moveCounter++);
    numMoves[0].textContent = moveCounter;
    const stars = document.querySelector('.stars');
    const emptyStar = '<i class="icon-star-empty"></i>';
    if (moveCounter === 8) {

        stars.removeChild(stars.lastElementChild);

    }

    if (moveCounter === 12) {

        stars.removeChild(stars.lastElementChild);
    }

    if (moveCounter === 16) {

        stars.removeChild(stars.lastElementChild);
    }
    if (moveCounter === 20) {

        stars.removeChild(stars.lastElementChild);
    }


}
/* increment moves ends */

/* Resets in case a player presses reset button or re plays after winning. */
function resetGame() {

    moveCounter = 0;
    minutes = 00;
    seconds = 00;
    min = 1;
    sec = 0;
    const numMoves = document.getElementsByClassName('moves');
    numMoves[0].textContent = moveCounter;
    matchedCards = [];
    elemOpened = [];
    document.location.reload();

}
 /* reset complete */