import { emojiFoods } from './emoji-foods.js';
import { shuffleArray} from './utils/shuffleArray.js';

// INDICACIONES:
/**
 *
 * Empezar el juego cuando el usuario haga click en el botón
 * .start-btn
 *
 * Crear las cards con los emojis usando el template
 * #template-card
 *
 * Cada board generado debe ser aleatorio y tiene que estar barajado con un máximo de 16 cards 4x4
 * shuffleArray
 *
 * Añadir clase flipped a las cards cuando el usuario haga click
 * .board (delegación de eventos)
 *
 * Comprobar si las dos cartas son iguales y añadir clase match
 * .match
 *
 * Sumar un punto si son iguales y restar un punto si no lo son
 * Actualizar el contador de puntos
 * .score-board__item-score
 *
 * Iniciar el temporizador cuando se empieza el juego
 * Actualizar el contador de segundos
 * .score-board__item-time
 *
 * Mostrar el mensaje de fin de juego cuando hagan match todas las cards
 * .finish-display
 *
 * Cuando el usuario quiera volver a jugar: ocultar mensaje fin de juego, resetear contador de puntos, segundos y board
 *
 *
 * ⭐BONUS⭐: Compartir en redes sociales que has terminado el proyecto
 * Haz ctrl + click en este link para compartir en Twitter:
 * https://twitter.com/intent/tweet?url=https%3A%2F%2Fnaviscode.gumroad.com%2Fl%2Ffrontend-fastlane-plan&text=Completado%20el%20proyecto%20del%20curso%20del%20DOM%20del%20Frontend%20Fastlane%20Plan%20de%20%40NavisCode%0A%0A%F0%9F%9A%80%20A%20por%20el%20siguiente%20reto%21%0A%0A
 *
 */


// selectores del dom

const startBtn = document.querySelector(".start-btn") //button para iniciar el juego
const template = document.querySelector("#template-card")
const board = document.querySelector(".board")
const scoreItem = document.querySelector(".score-board__item-score")
const timer = document.querySelector(".score-board__item-time")
const finishDisplay = document.querySelector(".finish-display")

let scoreCounter = 0;
const flippedCards = [];
let totalTime = 0;
let timeInterval = null

const fragment = document.createDocumentFragment()

startBtn.addEventListener("click", initGame)
board.addEventListener("click", flipCard)

//funcion para inicializar el juego
function initGame(){
    resetGame();
    createBoard();
    setInterval(upDateTime, 1000)

}

function resetGame() {
    board.innerHTML = "";
    clearInterval(timeInterval);
    totalTime = 0;
    timer.textContent = totalTime;
    scoreCounter = 0;
    scoreItem.textContent = scoreCounter;
    finishDisplay.classList.add("hide");
}

function createBoard(){    
    const randomArray = createRandomArrayFromOther(emojiFoods);
    const arrayRandomWithMatches = [...randomArray, ...randomArray];

    const shuffledArray = shuffleArray(arrayRandomWithMatches);

    shuffledArray.forEach((emoji) => {
        const card = createCard(emoji);
        fragment.append(card);
    });
    board.append(fragment);
}

function createRandomArrayFromOther(arrayToCopy, maxLength = 8) {
    const clonedArray = [...arrayToCopy];
    const randomArray = [];

    for (let i = 0; i < maxLength; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        const randomItem = clonedArray[randomIndex];

        randomArray.push(randomItem);
        clonedArray.splice(randomIndex, 1);
    }
    return randomArray;
}

  //funcion para crear las cards
function createCard({ id, emoji }) {
    const card = template.content.cloneNode(true);
    card.querySelector('.card').dataset.identity = id;
    card.querySelector('.card__back').textContent = emoji;
    return card;
}


function flipCard(event){
    const card = event.target.closest(".card");
    if(card && flippedCards.length < 2 && ! card.classList.contains('flipped')){
        card.classList.add("flipped")
        flippedCards.push(card);
        if(flippedCards.length === 2){
            checkIdentityMatch();
            finishGameIfNoMoreMatches();
        }
    }
}


function finishGameIfNoMoreMatches() {
    const numberOfMatches = board.querySelectorAll(".match").length;
    if (numberOfMatches === 16) {
        finishDisplay.classList.remove("hide");
        clearInterval(timeInterval);
    }
}

function checkIdentityMatch() {
    const [identity1, identity2] = flippedCards.map((card) => card.dataset.identity)

    if (identity1 === identity2) {
        flippedCards.forEach((card) => {
            card.classList.add('match');
        });
        flippedCards.length = 0;
        updateScoreCounter(1);
    } else {
        setTimeout(() => {
            flippedCards.forEach((card) => {
                card.classList.remove("flipped");
            }),
                (flippedCards.length = 0);
        }, 1000);
        updateScoreCounter(-1);
    }
}

function updateScoreCounter(score) {
    scoreItem.textContent = scoreCounter += score;
}


function upDateTime(){
    totalTime++;
    timer.textContent = totalTime;
}
