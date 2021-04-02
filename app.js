const difficultyButtons = document.querySelectorAll(".difficulty");
const gameBoard = document.querySelector(".wrapper");
const timerScreen = document.querySelector(".time");

const MARKS = "ABCDEFGHIJKLMNOPRSTUWYZX12345678";
const gameSettings = {
  usedNumbers: [],
  usedTiles: [],
  revealedTiles: 0,
  clickedTilesContent: null,
  clickedTiles: 0,
};

const startGame = (event) => {
  if (event.target.textContent === "easy") {
    drawGrid(4, 4);
    displayTiles(16);
  } else if (event.target.textContent === "medium") {
    drawGrid(6, 6);
    displayTiles(36);
  } else {
    drawGrid(8, 8);
    displayTiles(64);
  }
  gameSettings.usedNumbers.length = 0;
  gameSettings.usedTiles.length = 0;
  gameSettings.clickedTiles = 0;
};

const addMarks = (tiles) => {
  const { usedNumbers, usedTiles } = gameSettings;

  let randomNum = getRandomNumber(MARKS.length);
  while (usedNumbers.includes(randomNum)) {
    randomNum = getRandomNumber(MARKS.length);
  }
  usedNumbers.push(randomNum);

  let randomTile = getRandomNumber(tiles.length);
  while (usedTiles.includes(randomTile)) {
    randomTile = getRandomNumber(tiles.length);
  }
  usedTiles.push(randomTile);

  let randomPairTile = getRandomNumber(tiles.length);
  while (usedTiles.includes(randomPairTile)) {
    randomPairTile = getRandomNumber(tiles.length);
  }
  usedTiles.push(randomPairTile);

  tiles[randomTile].textContent = MARKS[randomNum];
  tiles[randomPairTile].textContent = MARKS[randomNum];
};

const getRandomNumber = (range) => Math.floor(Math.random() * range);

const displayTiles = (amount) => {
  gameBoard.innerHTML = "";

  for (let i = 0; i < amount; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    gameBoard.appendChild(tile);
    tile.addEventListener("click", discoverTile);
  }
  const tiles = document.querySelectorAll(".tile");
  for (let i = 0; i < amount / 2; i++) {
    addMarks(tiles);
  }
};

const resetTiles = (event, flag) => {
  const allTiles = document.querySelectorAll(".tile");

  allTiles.forEach((tile) => {
    tile.removeEventListener("click", discoverTile);
  });
  setTimeout(
    () => {
      gameSettings.clickedTilesContent = null;
      gameSettings.revealedTiles = 0;

      allTiles.forEach((element) => {
        element.style.color = "rgb(42, 184, 250)";
      });

      allTiles.forEach((tile) => {
        tile.addEventListener("click", discoverTile);
      });
    },
    flag ? 0 : 1500
  );
};

const discoverTile = (event) => {
  let isCorrect = false;
  gameSettings.clickedTiles = gameSettings.clickedTiles + 1;

  let { revealedTiles, clickedTilesContent } = gameSettings;

  if (clickedTilesContent === event.target.textContent) {
    const allTiles = [...document.querySelectorAll(".tile")];
    const tilesToRemove = allTiles.filter(
      (tile) => tile.textContent === event.target.textContent
    );
    tilesToRemove.forEach((tile) => {
      // gameBoard.removeChild(tile);
      tile.classList.remove("tile");
      tile.classList.add("reject");
      tile.removeEventListener("click", discoverTile);
    });
    if (allTiles.length === 2) {
      winGame();
    }
    isCorrect = true;
  }
  if (revealedTiles === 1) {
    resetTiles(event, isCorrect);
  }
  gameSettings.clickedTilesContent = event.target.textContent;
  event.target.style.color = "white";
  gameSettings.revealedTiles = gameSettings.revealedTiles + 1;
};

const drawGrid = (row, col) => {
  gameBoard.style.gridTemplateRows = `repeat(${row}, 1fr)`;
  gameBoard.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
};

difficultyButtons.forEach((button) => {
  button.addEventListener("click", startGame);
});

const winGame = () => {
  gameBoard.innerHTML = `
  <h1>You won! miszczó</h1>
  <h3>Clicked ${gameSettings.clickedTiles} times</h3>
  `;
};
