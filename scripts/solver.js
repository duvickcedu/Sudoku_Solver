const arrayOfInputs = getInputBoxes();
const testBoard = [
    [4, 7, 9, 6, 5, 1, 3, 2, 0],
    [0, 0, 3, 0, 4, 0, 9, 6, 0],
    [5, 2, 0, 0, 8, 9, 0, 1, 7],
    [0, 6, 1, 0, 7, 0, 5, 4, 0],
    [2, 9, 7, 4, 3, 0, 1, 8, 6],
    [0, 0, 5, 8, 1, 0, 0, 7, 0],
    [0, 3, 2, 1, 6, 0, 0, 0, 4],
    [0, 0, 8, 5, 0, 0, 0, 3, 2],
    [0, 0, 0, 0, 2, 3, 8, 9, 0]
];

/**
 * This method gets the input values from the DOM and turns it into a array.
 * The game board is represented as a 2D Array.
 * @returns {[]}
 */
function getGameBoard() {
    const inputs = document.querySelectorAll("input");
    const board = [];
    let row = [];
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === "") {
            row.push(0); // Zero indicates an empty spot on the board.
        } else {
            row.push(parseInt(inputs[i].value));
        }
        if (((row.length % 9) === 0) && (i !== 0)) {
            board.push(row);
            row = [];
        }
    }
    return board;
}

/**
 * Gets all of the input boxes. This is formatted in the same way as the game board
 * for ease of indexing.
 * @returns {[]}
 */
function getInputBoxes() {
    const inputs = document.querySelectorAll("input");
    const inputsArray = [];
    let row = [];
    for (let i = 0; i < inputs.length; i++) {
        row.push(inputs[i]);
        if (((row.length % 9) === 0) && (i !== 0)) {
            inputsArray.push(row);
            row = [];
        }
    }
    return inputsArray;
}

/**
 * Gets an empty position on the board and returns it
 * @param gameBoard
 * @returns {null|number[]}
 */
function getEmptyPosition(gameBoard) {
    for (let row = 0; row < gameBoard.length; row++) {
        for (let column = 0; column < gameBoard[row].length; column++) {
            if (gameBoard[row][column] === 0) {
                return [row, column];
            }
        }
    }
    return null;
}


/**
 * This method is the validator. It will check if a number is valid at any given position on the board.
 * @param gameBoard
 * @param value
 * @param positionArray
 * @returns {boolean}
 */
function isValid(gameBoard, value, positionArray) {
    const boardSize = gameBoard.length;

    //Checking if it's valid given the row.
    for (let index = 0; index < boardSize; index++) {
        if ((gameBoard[positionArray[0]][index] === value) && (index !== positionArray[1])) {
            return false;
        }
    }

    //Checking if it's valid given the column.
    for (let index = 0; index < boardSize; index++) {
        if ((gameBoard[index][positionArray[1]] === value) && (index !== positionArray[0])) {
            return false;
        }
    }

    //Checking the 3x3 grid
    const gridPositionX = Math.floor(positionArray[0] / 3);
    const gridPositionY = Math.floor(positionArray[1] / 3);
    for (let row = (gridPositionX * 3); row < (gridPositionX * 3) + 3; row++) {
        for (let column = (gridPositionY * 3); column < (gridPositionY * 3) + 3; column++) {
            if ((gameBoard[row][column] === value) && (row !== positionArray[0]) && (column !== positionArray[1])) {
                return false;
            }
        }
    }

    return true;
}

/**
 * This is the method that does the work for solving the board. This method uses a recursive backtracking
 * algorithm to complete the board.
 * @param gameBoard
 * @returns {boolean}
 */
function solveGameBoard(gameBoard) {
    /*
        base case of the algorithm
        if there are no more empty spots left on the game board
        then it is solved.
     */
    let emptyPosition = getEmptyPosition(gameBoard);
    if (emptyPosition === null) {
        return true; //break out of recursion
    }

    for (let value = 1; value < 10; value++) {
        if (isValid(gameBoard, value, emptyPosition) === true) {
            gameBoard[emptyPosition[0]][emptyPosition[1]] = value; //Sets to a valid number
            // arrayOfInputs[emptyPosition[0]][emptyPosition[1]].value = value;
            // arrayOfInputs[emptyPosition[0]][emptyPosition[1]].classList.add('solved');
            if (solveGameBoard(gameBoard) === true) { //recursive call to solve board
                return true;
            }
            gameBoard[emptyPosition[0]][emptyPosition[1]] = 0;
            // arrayOfInputs[emptyPosition[0]][emptyPosition[1]].value = 0;
            // arrayOfInputs[emptyPosition[0]][emptyPosition[1]].classList.remove('solved');
        }
    }
    return gameBoard;
}

/**
 * This method will check if the board that the user provided is valid and solvable.
 * @returns {boolean}
 */
function isValidBoard(board) {
    //Checking if any boxes are invalid by checking the "bad-input" class
    //bad input is input that isn't 1-9
    for (let row = 0; row < arrayOfInputs.length; row++) {
        for (let column = 0; column < arrayOfInputs[row].length; column++) {
            if (arrayOfInputs[row][column].classList.contains("bad-input")) {
                return false;
            }
            //Ensuring the board is a truly solvable by checking if each spot is valid
            if (board[row][column] !== 0 && isValid(board, board[row][column], [row, column]) === false) {
                return false
            }
        }
    }
    return true;
}

/**
 * When solve button is clicked this listener updates the page
 * with the solved game board.
 */
const solveButton = document.querySelector('#solve-button')
solveButton.addEventListener('click', ()=> {
    let board = getGameBoard();
    if (isValidBoard(board)) {
        solveGameBoard(board);
        updatePage(board);
        console.dir(board);
    } else {
        alert("You must enter a valid Sudoku board.");
    }
});

const updatePage = (board) => {
    const arrayOfInputs = getInputBoxes();
    for (let row = 0; row < arrayOfInputs.length; row++) {
        for (let column = 0; column < arrayOfInputs[row].length; column++) {
            if (arrayOfInputs[row][column].value === "") {
                arrayOfInputs[row][column].value = board[row][column];
                arrayOfInputs[row][column].classList.add("solved");
            }
        }
    }
}

/**
 * This clears the the board
 */
const clearButton = document.querySelector('#clear-button');
clearButton.addEventListener('click', () => {
    for (let row = 0; row < arrayOfInputs.length; row++) {
        for (let column = 0; column < arrayOfInputs[row].length; column++) {
            arrayOfInputs[row][column].value = "";
            arrayOfInputs[row][column].classList.remove("solved");
            arrayOfInputs[row][column].classList.remove("bad-input");
        }
    }
});

/**
 * Adding some invalid input checking
 */
function addInvalidListener() {
    const regex = /[1-9]/
    for (let row = 0; row < arrayOfInputs.length; row++) {
        for (let column = 0; column < arrayOfInputs[row].length; column++) {
            arrayOfInputs[row][column].addEventListener('input', () => {
                if (regex.test(arrayOfInputs[row][column].value) === false && arrayOfInputs[row][column].value !== "") {
                    arrayOfInputs[row][column].classList.add('bad-input');
                } else {
                    arrayOfInputs[row][column].classList.remove('bad-input');
                }
            })
        }
    }
}
addInvalidListener();

//for a later feature
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }