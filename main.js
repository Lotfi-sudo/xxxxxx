//* declaring game state object
const game = {
    x_score: 0,
    circle_score: 0
}
//* getting the grid cells from DOM
const board = []
for(let i =0; i<9; i++){
    board.push(document.getElementById('cell'+i))
}
//* icon paths
const x_icon = 'x.svg'
const circle_icon = 'circle.svg'

//* getting icon img elements from DOM
const icons = document.querySelectorAll('.icon')

//* combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7 ,8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
//* starting conditions
// this parameteres' initial value controlls which starts first 'X' or 'O' and whether it's a human or bot
let isCircleTurn = false;
let isHuman = false;
let i = 1

const gameScore = document.querySelector('.score')
//! Starting game
window.addEventListener('load', () => {
    // loadScores();
    updateScoreDisplay()
    gameStart();
});
function gameStart(){
    setHoverState()

    if(!isHuman){
        dumbBot(board)
    }

    board.forEach(cell => {
        cell.addEventListener('click', handleClick,{once:true});
    });
}
//! setHoverState function
function setHoverState(){
    board.filter(cell => !(cell.classList.contains('checked'))).forEach(cell => {
            const icon = cell.querySelector('.icon');
            icon.src = isCircleTurn ? circle_icon : x_icon;
    });
}
//! Placemark function
function placeMark(element, classname){
    element.classList.add('checked', classname);
}
//! Swapturn function
function swapTurn(){
    isCircleTurn = !isCircleTurn
    //* swapping icons for hover
    setHoverState()    
}

// ! handleClick function
function handleClick(e) {
    const cell = e.currentTarget;
    let currentClass = isCircleTurn ? 'circle' : 'x';
    if (!cell.classList.contains('checked')) {
        placeMark(cell, currentClass);
        //check for win combination
        if (checkForWin(currentClass)) {
            endGame(true);
        } else if (checkForDraw()) {
            endGame(false);
        } else {
            swapTurn();
            smartBot();
        }
    }
}
//TODO dumbBot function
function dumbBot(board){
    let currentClass = isCircleTurn ? 'circle' : 'x';
    const availableCells = board.filter( cell => !(cell.classList.contains('checked')) )
    let len = availableCells.length
    const random = availableCells[Math.floor(len*Math.random())]
    placeMark(random, currentClass)
    //check for win combination
    if (checkForWin(currentClass)) {
        endGame(true);
    } else if (checkForDraw()) {
        endGame(false);
    } else {
        swapTurn();
    }
}
// TODO smartBot function
function smartBot() {
    let bestScore = -Infinity;
    let bestMove = {};
    let currentClass = isCircleTurn ? 'circle' : 'x';
    
    const availableCells = board.filter(cell => !(cell.classList.contains('checked')));
    availableCells.forEach(emptyCell => {
        let index = board.indexOf(emptyCell);
        placeMark(emptyCell, currentClass);
        let score = minimax(board, 0, false, -Infinity, Infinity); // Add alpha and beta values
        if (score > bestScore) {
            bestScore = score;
            bestMove.index = index;
        }
        emptyCell.classList.remove('checked', currentClass);
    });
    
    placeMark(board[bestMove.index], currentClass);
    if (checkForWin(currentClass)) {
        endGame(true);
    } else if (checkForDraw()) {
        endGame(false);
    } else {
        swapTurn();
    }
}

// TODO minimax algorithm with alpha-beta pruning
function minimax(board, depth, isMaximizing, alpha, beta) {
    const currentClass = isMaximizing ? 'x' : 'circle';
    // Terminal conditions
    if (checkForWin('x')) {
        return 100 -depth;
    }
    if (checkForWin('circle')) {
        return depth -100;
    }
    if (checkForDraw()) {
        return 0;
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        const availableCells = board.filter(cell => !(cell.classList.contains('checked')));
        for (const emptyCell of availableCells) {
            placeMark(emptyCell, currentClass);
            let score = minimax(board, depth + 1, false, alpha, beta);
            emptyCell.classList.remove('checked', currentClass);
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        const availableCells = board.filter(cell => !(cell.classList.contains('checked')));
        for (const emptyCell of availableCells) {
            placeMark(emptyCell, currentClass);
            let score = minimax(board, depth + 1, true, alpha, beta);
            emptyCell.classList.remove('checked', currentClass);
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }
        return bestScore;
    }
}


// ! checkforwin function
function checkForWin(currentClass){
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index].classList.contains(currentClass)
        })
    })
}
// ! checkfordraw function
function checkForDraw(){
    return board.every(cell => {
        return cell.classList.contains('checked')
    })
}
// ! endgame function
function endGame(win){
    if(win){
        if (isCircleTurn) {
            game.circle_score++;
        } else {
            game.x_score++;
        }
        updateScoreDisplay();
        // saveScores();
    } else {
        console.log('DRAW')
    }
    clearBoard()
    
}

// !clearboard function 
function clearBoard(){
    board.forEach( cell => {
        cell.classList.remove('checked','x','circle')
    })
    i++
    if(i % 2 == 0){
        isHuman = true
        isCircleTurn = true
    } else {
        isHuman = false
        isCircleTurn = false
    }
    gameStart();
}


// function saveScores() {
//     localStorage.setItem('x_score', game.x_score);
//     localStorage.setItem('circle_score', game.circle_score);
// }

// Function to load scores from local storage
// function loadScores() {
//     const xScore = localStorage.getItem('x_score');
//     const circleScore = localStorage.getItem('circle_score');

//     if (xScore !== null) {
//         game.x_score = parseInt(xScore);
//     }

//     if (circleScore !== null) {
//         game.circle_score = parseInt(circleScore);
//     }

    
//     updateScoreDisplay();
// }

function updateScoreDisplay() {
    gameScore.innerHTML = "X: "+ game.x_score +" - "+ game.circle_score+" :O"
}