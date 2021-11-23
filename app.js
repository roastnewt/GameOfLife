//
// Game Model
//

const livingCell = ',';
const deadCell = 'O';

var Game = function() {
  this.gameState = [];
  this.gameSize = 50;
  this.isRunning = false;
  this.runTimerId = null;
}

Game.prototype.fillBoard = function() {
  this.gameState = [];
  for (let i = 0; i < this.gameSize; i++) {
    let row = [];
    for (let j = 0; j < this.gameSize; j++) {
      row.push(false);
    }
    this.gameState.push(row);
  }
}

Game.prototype.step = function() {
  let nextGameState = [];

  for (let i = 0; i < this.gameState.length; i++) {
    let row = [];
    for (let j = 0; j < this.gameState[i].length; j++) {
      row.push(false);
    }
    nextGameState.push(row);
  }

  for (let i = 0; i < this.gameState.length; i++) {
    for (let j = 0; j < this.gameState[i].length; j++) {
      nextGameState[i][j] = this.doesCellLive(i, j);
    }
  }

  this.gameState = nextGameState;
}

Game.prototype.doesCellLive = function(i, j) {
  let neighbors = this.numberOfAdjacentCells(i, j);
  if (this.gameState[i][j]) {
    if (neighbors < 2) {
      // if the cell is alive and has < 2 neighbors, dies of underpopulation
      return false;
    } else if (neighbors > 3) {
      // if the cell is alive and has > 3 neighbors, dies of overpopulation
      return false;
    } else {
      // perfect amount of neighbors to live!
      return true;
    }
  } else {
    if (neighbors === 3) {
      // empty cell with 3 neighbors comes alive through reproduction
      return true;
    }
  }
}

Game.prototype.numberOfAdjacentCells = function(i, j) {
  let count = 0;
  if (i > 0 && j > 0 && this.gameState[i-1][j-1]) {
    count++;
  }
  if (j > 0 && this.gameState[i][j-1]) {
    count++;
  }
  if (i < (this.gameState.length-1) && j > 0 && this.gameState[i+1][j-1]) {
    count++;
  }
  if (i > 0 && this.gameState[i-1][j]) {
    count++;
  }
  if (i < (this.gameState.length-1) && this.gameState[i+1][j]) {
    count++;
  }
  if (i > 0 && j < (this.gameState.length-1) && this.gameState[i-1][j+1]) {
    count++;
  }
  if (j < (this.gameState.length-1) && this.gameState[i][j+1]) {
    count++;
  }
  if (i < (this.gameState.length-1) && j < (this.gameState.length-1) && this.gameState[i+1][j+1]) {
    count++;
  }
  return count;
}

//
// Game View
//

Game.prototype.createBoardHTML = function() {
  let html = document.createElement('tbody');
  for (let i = 0; i < this.gameState.length; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < this.gameState[i].length; j++) {
      let td = document.createElement('td');
      td.id = `${i}:${j}`;
      if (this.gameState[i][j]) {
        td.className = 'living';
        td.innerHTML = livingCell;
      } else {
        td.className = 'dead';
        td.innerHTML = deadCell;
      }
      tr.append(td);
    }
    html.append(tr);
  }
  return html;
}

//
// Initialize Game
//

var GOL = new Game();
GOL.fillBoard();
console.log(GOL);

//
// Click Handlers
//

let stepClickHandler = () => {
  GOL.step();
  let board = document.getElementById('board');
  board.innerHTML = '';
  document.getElementById('board').appendChild(GOL.createBoardHTML());
}

let startClickHandler = () => {
  if (!GOL.isRunning) {
    GOL.isRunning = true;
    GOL.runTimerId = setInterval(stepClickHandler, 500);
  }
}

let stopClickHandler = () => {
  if (GOL.isRunning) {
    GOL.isRunning = false;
    clearInterval(GOL.runTimerId);
    GOL.runTimerId = null;
  }
}

let boardClickHandler = (event) => {
  let coords = event.target.id;
  let separator = coords.indexOf(':');
  let row = Number(coords.substring(0, separator));
  let col = Number(coords.substring(separator+1));

  if (event.target.innerHTML === deadCell) {
    GOL.gameState[row][col] = true;
    event.target.className = 'living';
    event.target.innerHTML = livingCell;
  } else if (event.target.innerHTML === livingCell) {
    GOL.gameState[row][col] = false;
    event.target.className = 'dead';
    event.target.innerHTML = deadCell;
  } else {
    console.log('wat');
  }
}

var DOMReady = function() {
  document.getElementById('board').appendChild(GOL.createBoardHTML());
  document.getElementById('board').addEventListener('click', boardClickHandler);
  document.getElementById('nextStep').addEventListener('click', stepClickHandler);
  document.getElementById('start').addEventListener('click', startClickHandler);
  document.getElementById('stop').addEventListener('click', stopClickHandler);
};

document.addEventListener('DOMContentLoaded', DOMReady);