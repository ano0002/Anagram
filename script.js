const consonnants = 'bcdfghjklmnpqrstvwxyz';
const vowels = 'aeiou';

const cells = document.querySelectorAll('.grid-cell');
const inputField = document.getElementById('guess-input');
const deleteButton = document.getElementById('delete');
const submitButton = document.getElementById('submit');
const shuffleButton = document.getElementById('shuffle');
const scoreDisplay = document.getElementById('score');
const maxScoreDisplay = document.getElementById('max-score');
const timerDisplay = document.getElementById('time');
const afterGameBox = document.getElementById('after-game');
const wordsFoundDisplay = document.getElementById('words-found');
const wordsNotFoundDisplay = document.getElementById('words-not-found');

let wordList = [];
let availableLetters = []
let possibleWords = [];
let foundWords = [];
let currentInput = '';
let playing = false;
let score = 0;
let timer = 60;
let timerInterval;

const correctAnswer = [
  { backgroundColor: "#0e0d0d" },
  { backgroundColor: "#14290a" },
  { backgroundColor: "#0e0d0d" },
];
const incorrectAnswer = [
  { backgroundColor: "#0e0d0d" },
  { backgroundColor: "#521414" },
  { backgroundColor: "#0e0d0d" },
];
const alreadyAnswered = [
    { backgroundColor: "#0e0d0d" },
    { backgroundColor: "#090b1d" },
    { backgroundColor: "#0e0d0d" },
];

// Fetch the words from the text file
fetch('./words.txt')
    .then(response => response.text())
    .then(text => {
        wordList = text.split(/\r?\n/).filter(word => word.trim() !== '');
        console.log("Word list loaded successfully.");

        deleteButton.addEventListener('click', deleteInput);

        shuffleButton.addEventListener('click', shuffleFill);

        submitButton.addEventListener('click', () => playing ? submitWord() : startGame());

        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', function(e) {
                if (!e.target.classList.contains('selected')) {
                    e.target.classList.add('selected');
                    const letter = e.target.textContent;
                    currentInput += letter;
                    inputField.value = currentInput;
                }
            });
        }

});



function generateLetters() {
    availableLetters = [];
    const vowelCount = Math.floor(Math.random() * 3) + 2; // Randomly choose between 2 to 4 vowels
    for (let i = 0; i < cells.length; i++) {
        const isVowel = i < vowelCount;
        const letter = isVowel ? vowels[Math.floor(Math.random() * vowels.length)] : consonnants[Math.floor(Math.random() * consonnants.length)];
        availableLetters.push(letter);
    }
}

function shuffleFill() {
    // Shuffle the available letters
    availableLetters = availableLetters.sort(() => Math.random() - 0.5);
    // Fill the grid with the letters
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = availableLetters[i];
        cells[i].classList.remove('selected'); // Clear any previous selections
    }
}

function deleteInput(){
    currentInput = "";
    inputField.value = currentInput;
    const selectedCells = document.querySelectorAll('.grid-cell.selected');
    selectedCells.forEach(cell => {
        cell.classList.remove('selected');
    });
}

function getAllPossibleWords() {
    // Use available letters to filter the word list 
    // (paying attention to duplicates like if 'a' appears twice in the word it must appear twice in the available letters)
    return wordList.filter(word => {
        const duplicateAvailableLetters = [...availableLetters];
        for (let letter of word) {
            const index = duplicateAvailableLetters.indexOf(letter);
            if (index === -1) {
                return false; // Letter not available
            }
            duplicateAvailableLetters.splice(index, 1); // Remove the letter to account for duplicates
        }
        return true; // All letters are available
    });
}

function startGame() {
    submitButton.textContent = "SUBMIT";
    availableLetters = [];
    possibleWords = [];
    while (possibleWords.length < 5) {
        generateLetters();
        possibleWords = getAllPossibleWords();
    }
    maxScoreDisplay.textContent = possibleWords.length;
    console.log("Possible words generated:", possibleWords);

    scoreDisplay.textContent = 0;
    wordsFoundDisplay.textContent = '';
    wordsNotFoundDisplay.textContent = '';
    afterGameBox.style.display = 'none';
    deleteInput();
    playing = true;
    score = 0;
    currentInput = '';
    foundWords = [];
    inputField.value = currentInput;
    shuffleFill();
    startTimer();
}

function startTimer() {
    timer = 90; // Reset timer to 60 seconds
    timerDisplay.textContent = timer;
    clearInterval(timerInterval); // Clear any existing timer
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer -= 1;
            timerDisplay.textContent = timer;
        } else {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    playing = false;
    clearInterval(timerInterval);
    afterGameBox.style.display = 'block';
    wordsNotFoundDisplay.textContent = possibleWords.filter(word => !foundWords.includes(word)).join(', ');
    submitButton.textContent = "START";
    deleteInput();

}

function submitWord() {
    const inputWord = inputField.value.toLowerCase();
    if (possibleWords.includes(inputWord)) {
        if (foundWords.includes(inputWord)) {
            console.log("Word already found.");
            inputField.animate(alreadyAnswered, { duration: 500, fill: 'forwards' });
        }
        else {
            foundWords.push(inputWord);
            console.log("Word found:", inputWord);
            wordsFoundDisplay.textContent = foundWords.join(', ');
            score += 1;
            scoreDisplay.textContent = score;
            inputField.animate(correctAnswer, { duration: 500, fill: 'forwards' });
        }
    }
    else {
        console.log("Word not found in the list.");
        inputField.animate(incorrectAnswer, { duration: 500, fill: 'forwards' });
    }
    deleteInput();
}