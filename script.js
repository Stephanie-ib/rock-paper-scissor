let confirmReset = false;
let isGameLocked = false;

const buttonSound = new Audio("./sounds/click.wav");
const winSound = new Audio("./sounds/win_sound.ogg");
const loseSound = new Audio("./sounds/lose_sound.wav");

const score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  ties: 0,
};

const resultElement = document.querySelector(".js-result");
const scoreElement = document.querySelector(".js-score");
const confirmBox = document.querySelector(".confirm-message");
const yesButton = document.querySelector(".yes-button");
const noButton = document.querySelector(".no-button");
const playerMoveElement = document.querySelector(".js-player-move");
const computerMoveElement = document.querySelector(".js-computer-move");

function pickComputerMove() {
  let computerMove = "";
  const randomNumber = Math.random();

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = "rock";
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = "paper";
  } else {
    computerMove = "scissors";
  }

  return computerMove;
}

function updateScoreElement() {
  scoreElement.innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function animateButton(button = null) {
  if (!button) return;
  button.classList.add("clicked");
  setTimeout(() => {
    button.classList.remove("clicked");
  }, 300);
}

function playSound(result) {
  buttonSound.play();
  if (result === "You win 🎉") {
    winSound.play();
  } else if (result === "You lose 😔") {
    loseSound.play();
  }
}

function playGame(playerMove) {
  if (isGameLocked) return;

  isGameLocked = true;

  const computerMove = pickComputerMove();
  const result = getResult(playerMove, computerMove);

  buttonSound.play();

  setTimeout(() => {
    playSound(result);

    if (result === "You win 🎉") score.wins++;
    else if (result === "You lose 😔") score.losses++;
    else score.ties++;

    localStorage.setItem("score", JSON.stringify(score));
    updateScoreElement();
    resultElement.innerHTML = result;
    playerMoveElement.innerHTML = `<img src="images/${playerMove}-emoji.png" class="move-icon">`;
    computerMoveElement.innerHTML = `<img src="images/${computerMove}-emoji.png" class="move-icon">`;

    isGameLocked = false;
  }, 600);
}

// Function to determine the result of the game
function getResult(playerMove, computerMove) {
  if (playerMove === computerMove) return "Tie";
  if (
    (playerMove === "rock" && computerMove === "scissors") ||
    (playerMove === "paper" && computerMove === "rock") ||
    (playerMove === "scissors" && computerMove === "paper")
  )
    return "You win 🎉";
  return "You lose 😔";
}

// Reset score function
function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem("score");
  updateScoreElement();
}

function confirmMessage() {
  confirmBox.classList.remove("hidden");
}

// Event listeners
document.querySelector(".rock-button").addEventListener("click", (e) => {
  animateButton(e.currentTarget);
  playGame("rock");
});

document.querySelector(".paper-button").addEventListener("click", (e) => {
  animateButton(e.currentTarget);
  playGame("paper");
});

document.querySelector(".scissor-button").addEventListener("click", (e) => {
  animateButton(e.currentTarget);
  playGame("scissors");
});

document.querySelector(".reset-button").addEventListener("click", (e) => {
  animateButton(e.currentTarget);
  buttonSound.play();
  confirmMessage();
});

yesButton.addEventListener("click", () => {
  resetScore();
  confirmReset = true;
  confirmBox.classList.add("hidden");
});

noButton.addEventListener("click", () => {
  confirmReset = false;
  confirmBox.classList.add("hidden");
});

// Keyboard Controls
document.body.addEventListener("keydown", (event) => {
  if (event.key === "r") playGame("rock");
  else if (event.key === "p") playGame("paper");
  else if (event.key === "s") playGame("scissors");
  else if (event.key === "Backspace") confirmMessage();
});

// Initialize
updateScoreElement();
