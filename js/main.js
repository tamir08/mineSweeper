'use strict';
const MINE = '💣';
const MARK = '🚩';
var gBoard;
var gGame = { isOn: false }
var gLevel = {
   SIZE: 3,
   MINES: 2
};

var gTimerInterval = null;


function initGame() {
   gGame.isOn = false;
   gGame.shownCount = 0;
   gGame.markedCount = 0;
   gGame.lives = 3;
   clearInterval(gTimerInterval);
   gBoard = buildBoard();
   renderBoard(gBoard);


}


function buildBoard() {

   var board = [];

   for (var i = 0; i < gLevel.SIZE; i++) {

      board[i] = [];
      for (var j = 0; j < gLevel.SIZE; j++) {

         board[i][j] = {
            minesAroundCount: 0,
            isMine: false,
            isShown: false,
            isMarked: false
         }
      }
   }
   return board;
}


function addMines(board, clickedI, clickedJ) {

   var farCells = getFarCells(board, clickedI, clickedJ)

   var mines = getRndLocations(farCells);

   var idxI;
   var idxJ;

   for (var mineIdx = 0; mineIdx < mines.length; mineIdx++) {
      idxI = mines[mineIdx].i;
      idxJ = mines[mineIdx].j;
      board[idxI][idxJ].isMine = true;
   }

   setMinesNegsCount(board)
   renderBoard(board)
}


function getFarCells(board, cellI, cellJ) {
   var possibleCells = [];
   var count = 0;

   for (var i = 0; i < board.length; i++) {

      for (var j = 0; j < board[0].length; j++) {

         if ((Math.abs(i - cellI) > 1) || (Math.abs(j - cellJ) > 1)) {
            possibleCells.push({ i: i, j: j })
            count++
         }
      }
   }

   return possibleCells;
}


function getRndLocations(cells) {
   var rndLocations = [];
   var numOfMines = gLevel.MINES;
   for (var i = 0; i < numOfMines; i++) {
      var rndIdx = getRandomInt(cells.length);
      rndLocations.push(cells.splice(rndIdx, 1)[0])
   }
   return rndLocations;

}


function setMinesNegsCount(board) {

   for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {

         if (!(board[i][j].isMine))
            board[i][j].minesAroundCount = countMinesAround(board, i, j);
      }
   }
}


function countMinesAround(mat, idxI, idxJ) {

   var mineNegsSum = 0;
   for (var i = idxI - 1; i <= idxI + 1; i++) {

      if (i < 0 || i >= mat.length) continue;

      for (var j = idxJ - 1; j <= idxJ + 1; j++) {

         if (i === idxI && j === idxJ) continue;

         if (j < 0 || j >= mat[i].length) continue;

         if (mat[i][j].isMine) mineNegsSum++;
      }
   }

   return mineNegsSum;
}


function startGame(i, j) {
   gGame.isOn = true;
   gGame.startTime = Date.now();
   startTimer()
   addMines(gBoard, i, j)
}


function getLevel() {
   var level = +document.querySelector('.level').value;
   switch (level) {

      case 1:
         gLevel.SIZE = 4;
         gLevel.MINES = 2;
         break;

      case 2:
         gLevel.SIZE = 6
         gLevel.MINES = 8;
         break;

      case 3:
         gLevel.SIZE = 8;
         gLevel.MINES = 12;
         break;

      case 4:
         gLevel.SIZE = 10;
         gLevel.MINES = 20;
         break;

      case 5:
         gLevel.SIZE = 12;
         gLevel.MINES = 30;
         break;
      
      case 6:
         gLevel.SIZE = 15;
         gLevel.MINES = 40;
         break;
      
      case 7:
         gLevel.SIZE = 20;
         gLevel.MINES = 80;
         break;
   }
   initGame()
}

function renderBoard(board) {

   var strHTML = '';
   var cellContent = '';
   for (var i = 0; i < gLevel.SIZE; i++) {

      strHTML += '<tr>'
      for (var j = 0; j < gLevel.SIZE; j++) {

         cellContent = '';
         if (board[i][j].isMarked)
            cellContent = MARK;

         else {
            if (board[i][j].isShown) {

               if (board[i][j].isMine)
                  cellContent = MINE;

               else
                  cellContent = board[i][j].minesAroundCount;
            }
         }

         strHTML += getTdHTML(cellContent, i, j);
      }
      strHTML += '</tr>'
   }

   var elBoard = document.querySelector('tbody');
   elBoard.innerHTML = strHTML;

}


function renderCell(elCell, i, j) {

   var cellContent = '';

   if (gBoard[i][j].isMarked) {
      cellContent = MARK;

   } else if (gBoard[i][j].minesAroundCount && gBoard[i][j].isShown) {
      cellContent = gBoard[i][j].minesAroundCount;
   }

   elCell.innerHTML = getTdHTML(cellContent, i, j);
}


function getTdHTML(value, i, j) {
   return `<td class="cell-${i}-${j}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(event, this,${i},${j})">${value}</td>`;

}


function cellMarked(ev, elCell, i, j) {

   ev.preventDefault();
   if (!gGame.isOn) return;
   if (gBoard[i][j].isShown) return;
   if (gBoard[i][j].isMarked) {
      gBoard[i][j].isMarked = false;
      gGame.markedCount--;

   } else {
      gBoard[i][j].isMarked = true;
      gGame.markedCount++;
   }
   renderCell(elCell, i, j);
   document.querySelector('.markCount').innerText = gGame.markedCount;

}


function cellClicked(elCell, i, j) {

   if (!gGame.isOn) {
      if (!gGame.shownCount) {
         startGame(i, j);
         elCell = document.querySelector(`.cell-${i}-${j}`);
      }
   }

   if (gBoard[i][j].isShown) return;
   if (gBoard[i][j].isMarked) return;

   if (gBoard[i][j].isMine) {
     
      gBoard[i][j].isShown = true;
      elCell.innerText = MINE;
      elCell.classList.add('clicked')
      console.log('Mine')
      checkGameOver()
      return;
   }

   gBoard[i][j].isShown = true;
   gGame.shownCount++;
   renderCell(elCell, i, j)
   elCell.classList.add('clicked')
   playSound('blop')
   if (gBoard[i][j].minesAroundCount == 0) {
      expandShown(i, j)
      playSound('tone')
   }


   document.querySelector('.cellCount').innerText = gGame.shownCount;

   if (gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES) endGame(true)
}

function checkGameOver() {
   gGame.lives--;

   // document.querySelector('.lives').innerText = gGame.lives;
   if (gGame.lives <= 0) {

      playSound('bomb')
      endGame(false);
      return true

   }
   playSound('punch')
   return false

}


function expandShown(idxI, idxJ) {

   for (var i = idxI - 1; i <= idxI + 1; i++) {

      if (i < 0 || i >= gBoard.length) continue;

      for (var j = idxJ - 1; j <= idxJ + 1; j++) {

         if (j < 0 || j >= gBoard[i].length) continue;

         if (gBoard[i][j].isShown || gBoard[i][j].isMine || gBoard[i][j].isMarked) continue;

         gBoard[i][j].isShown = true;
         gGame.shownCount++;
         var cellClass = `cell-${i}-${j}`;
         var elCurrCell = document.querySelector('.' + cellClass);
         renderCell(elCurrCell, i, j)
         elCurrCell.classList.add('clicked')


         if (gBoard[i][j].minesAroundCount == 0) expandShown(i, j)
      }
   }
}


function endGame(isWon) {
   clearInterval(gTimerInterval);
   gGame.isOn = false;
   var elMsg = document.querySelector('h1');
   elMsg.innerText = isWon ? 'victory' : 'baby try again';
   revealMines();
}


function revealMines() {

   for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
         if (gBoard[i][j].isMine) {
            gBoard[i][j].isShown = true;
            // document.querySelector(`.cell-${i}-${j}`)=MINE;
         }
      }

   }
   renderBoard(gBoard);
}


function startTimer() {
   var elTimer = document.querySelector('.timer')
   gTimerInterval = setInterval(function () {
      var displyTime = Date.now() - gGame.startTime;
      elTimer.innerText = displyTime.toLocaleString();
   }, 173);
}


function getRandomInt(max) {
   return Math.floor(Math.random() * (max - 1));
}


function playSound(efect) {
   var sound = new Audio('media/' + efect + '.mp3')
   sound.play();

}