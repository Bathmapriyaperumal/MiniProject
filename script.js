const board = document.getElementById("gameBoard");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const moveCounter = document.getElementById("moveCounter");
const timerDisplay = document.getElementById("timer");
const starsDisplay = document.getElementById("stars");
const difficultySelect = document.getElementById("difficulty");
const themeToggle = document.getElementById("themeToggle");
const scoreDisplay = document.getElementById("score");
const modal = document.getElementById("modal");
const finalStats = document.getElementById("finalStats");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const emojis = [
  '🍎','🍌','🍉','🍇','🍒','🍓','🍍','🥝','🍋','🫐','🍑','🍊','🥕','🥑','🌽','🍅',
  '🧀','🥩','🍗','🍖','🍕','🍔','🍟','🥪','🍿','🍰','🍫','🍭','🍬','🍩','🥜','🥓',
  '🥨','🍣','🍤','🍛','🥘','🍱','🍜','🍚','🥗','🍞','🥯','🥮'
];

let flipped = [], matched = 0, moves = 0, timer = 0, score = 0;
let interval = null, lockBoard = false, currentLevel = 'easy';
let gameStarted = false;

window.onload = () => setupGame();

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", setupGame);
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
difficultySelect.addEventListener("change", () => {
  currentLevel = difficultySelect.value;
  setupGame();
});
nextLevelBtn.addEventListener("click", () => {
  if (currentLevel === 'easy') currentLevel = 'medium';
  else if (currentLevel === 'medium') currentLevel = 'hard';
  difficultySelect.value = currentLevel;
  setupGame();
});

function setupGame() {
  clearInterval(interval);
  flipped = [];
  matched = 0;
  moves = 0;
  timer = 0;
  score = 0;
  gameStarted = false;
  lockBoard = false;
  updateStats();
  board.innerHTML = "";
  modal.classList.add("hidden");
  nextLevelBtn.classList.add("hidden");
  startBtn.disabled = false;

  const count = getCardCount();
  const set = shuffle([...emojis]).slice(0, count / 2);
  const deck = shuffle([...set, ...set]);
  const gridSize = Math.sqrt(count);
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  deck.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${symbol}</div>
        <div class="card-back">❓</div>
      </div>`;
    card.addEventListener("click", () => flipCard(card, symbol));
    board.appendChild(card);
  });
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startBtn.disabled = true;
  interval = setInterval(() => {
    timer++;
    updateStats();
  }, 1000);
}

function flipCard(card, symbol) {
  if (!gameStarted || lockBoard || card.classList.contains("flip")) return;
  card.classList.add("flip");
  flipped.push({ card, symbol });

  if (flipped.length === 2) {
    moves++;
    lockBoard = true;
    setTimeout(checkMatch, 800);
  }

  updateStats();
}

function checkMatch() {
  const [a, b] = flipped;
  if (a.symbol === b.symbol) {
    matched++;
    score += 10;
    if (matched === getCardCount() / 2) return winGame();
  } else {
    score = Math.max(0, score - 2);
    a.card.classList.remove("flip");
    b.card.classList.remove("flip");
  }
  flipped = [];
  lockBoard = false;
  updateStars();
  updateStats();
}

function updateStats() {
  moveCounter.textContent = `Moves: ${moves}`;
  timerDisplay.textContent = `Time: ${timer}s`;
  scoreDisplay.textContent = `Points: ${score}`;
}

function updateStars() {
  const limit = getCardCount();
  starsDisplay.textContent =
    moves < limit ? "⭐️⭐️⭐️" :
    moves < limit * 1.5 ? "⭐️⭐️" : "⭐️";
}

function getCardCount() {
  if (currentLevel === 'medium') return 36;
  if (currentLevel === 'hard') return 100; // hard level more challenging
  return 16;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function winGame() {
  clearInterval(interval);
  finalStats.textContent = `Moves: ${moves}, Time: ${timer}s, Points: ${score}`;
  modal.classList.remove("hidden");
  if (currentLevel !== 'hard') nextLevelBtn.classList.remove("hidden");
}
