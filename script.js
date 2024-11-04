const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const botButton = document.getElementById('botButton');
let isBot = false;  // Flag to check if bot is active
let currentPlayer = 'X';
let isGameOver = false;
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize the game
function startGame() {
    currentPlayer = 'X';
    isGameOver = false;
    cellElements.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o');
        cell.addEventListener('click', handleClick, { once: true });
    });
    winningMessageElement.classList.remove('active');
}

function handleClick(e) {
    const cell = e.target;

    if (cell.innerText === '') {
        placeMark(cell, currentPlayer);

        if (checkWin(currentPlayer)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();

            // If bot is active and it's O's turn, make the bot move
            if (isBot && currentPlayer === 'O') {
                botMove();
            }
        }
    }
}

// Place mark (X or O) in the cell
function placeMark(cell, currentClass) {
    cell.innerText = currentClass;
    cell.classList.add(currentClass);
}

// Swap player turns
function swapTurns() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Check if the current player has won
function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cellElements[index].innerText === currentClass;
        });
    });
}

// Check for a draw
function isDraw() {
    return [...cellElements].every(cell => {
        return cell.innerText === 'X' || cell.innerText === 'O';
    });
}

// End the game
function endGame(draw) {
    isGameOver = true;
    if (draw) {
        winningMessageTextElement.innerText = "Draw!";
    } else {
        winningMessageTextElement.innerText = `${currentPlayer} Wins!`;
    }
    winningMessageElement.classList.add('active');
}

// Restart the game
restartButton.addEventListener('click', startGame);

// Handle bot move
function botMove() {
    const availableCells = [...cellElements].filter(cell => cell.innerText === '');
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    placeMark(randomCell, 'O');

    if (checkWin('O')) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

// Two-player button
twoPlayerButton.addEventListener('click', () => {
    isBot = false;
    startGame();
});

// Bot button
botButton.addEventListener('click', () => {
    isBot = true;
    startGame();
});

// Start the game initially
startGame();