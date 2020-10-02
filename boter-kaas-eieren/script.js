// Game Logic
const scoreDisplay = document.querySelector('.game-score');
const statusDisplay = document.querySelector('.game-status');
let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let playerScoreX = 0;
let playerScoreO = 0;

const winningMessage = () => `Speler ${currentPlayer} heeft gewonnen!`;
const drawMessage = () => `Gelijkspel!`;
const currentPlayerTurn = () => `Speler ${currentPlayer} is aan de beurt`;
const playerScore = () => `${playerScoreX} - ${playerScoreO}`;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

statusDisplay.innerHTML = currentPlayerTurn();

scoreDisplay.innerHTML = playerScore();

function handleScoreSet() {
  if (currentPlayer === 'X') {
    playerScoreX++;
  } else {
    playerScoreO++;
  }
  scoreDisplay.innerHTML = playerScore();
}

function handleScoreReset() {
  handleRestartGame();
  sendGameData();
  playerScoreX = 0;
  playerScoreO = 0;
  scoreDisplay.innerHTML = playerScore();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    handleScoreSet();
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }
  let roundDraw = !gameState.includes('');
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }
  handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute('data-cell-index')
  );
  if (gameState[clickedCellIndex] !== '' || !gameActive) {
    return;
  }
  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = 'X';
  gameState = ['', '', '', '', '', '', '', '', ''];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
}

function sendGameData() {
    const xhr = new XMLHttpRequest();
    const userId = Math.random();
    const post = {
        title: 'Match Data',
        body: { X: playerScoreX, O: playerScoreO},
        userId: userId
    };
    xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts');
    xhr.send(JSON.stringify(post));
}

document
  .querySelectorAll('.cell')
  .forEach((cell) => cell.addEventListener('click', handleCellClick));
document
  .querySelector('#restart-btn')
  .addEventListener('click', handleRestartGame);
document
  .querySelector('#reset-score-btn')
  .addEventListener('click', handleScoreReset);

// Footer Year
document.getElementById('current-year').innerHTML = new Date().getFullYear();
