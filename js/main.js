'use strict';
const MINE = '💣';
const MARK = '🚩';
var gBoard;
var gLevel = {
   SIZE: 4,
   MINES: 2
};



function initGame() {
   gBoard = buildBoard();
   console.table(gBoard)
   renderBoard(gBoard)
   addMines(gBoard);
   renderBoard(gBoard)

}



function buildBoard() {

   var board = [];

   for (var i = 0; i < gLevel.SIZE; i++) {

      board[i] = [];
      for (var j = 0; j < gLevel.SIZE; j++) {

         board[i][j] = {
            minesAroundCount: '',
            isMine: false,
            isShown: false,
            isMarked: false
         }
      }
   }
   return board;
}


function addMines(board) {
   board[0][0].isMine = true;
   // gBoard[0][0].isShown = true;
   board[1][2].isMine = true;
   // gBoard[1][2].isShown = true;
   setMinesNegsCount(board)
}

function setMinesNegsCount(board) {

   for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {

         // if (!(board[i][j].isMine))
         board[i][j].minesAroundCount += countMinesAround(board, i, j);
      }
   }
}


function countMinesAround(mat, idxI, idxJ) {
   // debugger
   var mineNegsSum = 0;
   for (var i = idxI - 1; i <= idxI + 1; i++) {

      if (i < 0 || i >= mat.length) continue;

      for (var j = idxJ - 1; j <= idxJ + 1; j++) {

         if (i === idxI && j === idxJ) continue;

         if (j < 0 || j >= mat[i].length) continue;

         if (mat[i][j].isMine) mineNegsSum++;
      }
   }
   // console.log('i',i,'j',j,'mines:',mineNegsSum)
   return mineNegsSum;
}



function renderBoard(board) {
   // console.log('board', board)


   var strHTML = '';
   var cellContent = '';
   for (var i = 0; i < board.length; i++) {
      // console.log('board', board)

      strHTML += '<tr>'
      for (var j = 0; j < board[0].length; j++) {

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

   var elBoard = document.querySelector('div tbody');
   elBoard.innerHTML = strHTML;
   elBoard.addEventListener("oncontextmenu", e => e.preventDefault());
}

function renderCell(elCell, i, j) {

   if (gBoard[i][j].isMarked) var cellContent = MARK;

   else var cellContent= (gBoard[i][j].isShown)? +gBoard[i][j].minesAroundCount:'';

   elCell.innerHTML = getTdHTML(cellContent, i, j);
}

function getTdHTML(value, i, j) {
   return `<td class="cell-${i}-${j}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(event, this,${i},${j})">${value}</td>`;

}
function cellMarked(ev, elCell, i, j) {
   ev.preventDefault();
   gBoard[i][j].isMarked = gBoard[i][j].isMarked ? false : true;
   console.log('MARK elCell, i, j', gBoard[i][j])
   renderCell(elCell, i, j);
}

function checkGameOver() { }
function expandShown(board, elCell, i, j) { console.log('expand') }


function cellClicked(elCell, i, j) {
   console.log(elCell, i, j)
   
   if (gBoard[i][j].isMine) {
      endGame()
   
   } else {

      if (gBoard[i][j].minesAroundCount > 0) {
         elCell.style.backgroundColor = "red";
         gBoard[i][j].isShown = true;
         renderCell(elCell, i, j)
      } else {
         expandShown(gBoard, elCell, i, j)
      }
   }
}




function endGame() {
   var elMsg = document.querySelector('h1');
   elMsg.innerText = 'baby try again';
   revealMines();
}


function revealMines() {

   for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
         if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
      }

   }
   renderBoard(gBoard);
}






function xx() { }


