// DOM Elements
const boxes = document.querySelectorAll('.box');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('game-status');
const scoreXDisplay = document.getElementById('score-x');
const scoreODisplay = document.getElementById('score-o');
const resetAllBtn = document.getElementById('reset-all-btn');
const nameXDisplay = document.getElementById('player1');
const nameODisplay = document.getElementById('player2');
const changeNamesBtn = document.getElementById('change-names-btn');
const resetNamesBtn = document.getElementById('reset-names-btn');

// Functions
const gameController = (function() {
    let playerX = "Player X";
    let playerO = "Player O";
    const tokenX = "X";
    const tokenO = "O";
    let activePlayerToken = tokenX;
    let isGameOver = false;
    let scoreX = 0;
    let scoreO = 0;
    

    function getActivePlayerName() {
        return activePlayerToken === tokenX ? playerX : playerO;
    }

    function resetScores() {
        scoreX = 0;
        scoreO = 0;
        scoreXDisplay.textContent = scoreX;
        scoreODisplay.textContent = scoreO;
        statusText.textContent = "Scores have been wiped clean.";
    }

    function checkWin(board) {
        for (let i = 0; i < 3; i++){
            if(board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return true;
            if(board[0][i] !== "" && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return true;
        }

        if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return true;
        if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true;

        return false;
    }

    function checkTie(board) {
        return board.every(row => row.every(cell => cell !== ""));
    }

    return {
        getActivePlayer: function() {
            return activePlayerToken === tokenX ? tokenX : tokenO;
        },

        resetPlayerNames: function() {
            playerX = "Player X";
            playerO = "Player O";
            
            nameXDisplay.textContent = playerX;
            nameODisplay.textContent = playerO;

            if (!isGameOver) {
                statusText.textContent = `${getActivePlayerName()}'s Turn`;
            }
        },

        setPlayerNames: function(newNameX, newNameO) {
            if (newNameX) playerX = newNameX.trim() || "Player X";
            if (newNameO) playerO = newNameO.trim() || "Player O";

            nameXDisplay.textContent = playerX;
            nameODisplay.textContent = playerO;

            if (!isGameOver) {
                statusText.textContent = `${getActivePlayerName()}'s Turn`;
            }
        },

        playTurn: function(row, col) {
            if (isGameOver) {
                statusText.textContent = "Game over.";
                return;
            }

            const currentToken = activePlayerToken === tokenX ? tokenX : tokenO;
            const moveSuccessful = gameBoard.makeMove(row,col,currentToken);

            if (moveSuccessful){
                const currentBoard = gameBoard.getGrid();

                if (checkWin(currentBoard)) {
                    statusText.textContent = `🥳🥳🥳 Player ${getActivePlayerName()} wins!!!`;
                    isGameOver = true;

                    if(activePlayerToken === tokenX) {
                        scoreX++;
                        scoreXDisplay.textContent = scoreX;
                    }

                    else {
                        scoreO++;
                        scoreODisplay.textContent = scoreO;
                    }
                    return;
                }

                if (checkTie(currentBoard)) {
                    statusText.textContent = "It's a tie.";
                    isGameOver = true;
                    return;
                }

                activePlayerToken = activePlayerToken === tokenX ? tokenO : tokenX;
                statusText.textContent = `It's now ${getActivePlayerName()}'s turn.`;
            }
        },

    restartGame: function () {
        activePlayerToken = tokenX;
        isGameOver = false;
        gameBoard.resetBoard();
        statusText.textContent = `${playerX}'s Turn`;
    },

    resetAllGameData: function() {
            this.restartGame(); 
            scoreX = 0;
            scoreO = 0;
            scoreXDisplay.textContent = scoreX;
            scoreODisplay.textContent = scoreO;    
        }
};
})();

const gameBoard = (function () {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    function drawBoard() {
        console.clear();
        console.log("  0   1   2 ");
        board.forEach((row, index) => {
            const formattedRow = row.map(cell => cell === "" ? " " : cell).join(" | ")
            console.log(`${index} ${formattedRow}`);
            if (index > 2) console.log("  ---------");
        });
    }

    drawBoard();

    return {
        getGrid: function () {
            return board.map(row => [...row]);
        },

        makeMove: function(row, col, player) {
            if (row < 0 || row > 2 || col < 0 || col > 2) {
                console.log("Invalid coordinates! Choose 0, 1, or 2.");
                return false;
            }

            if (board[row][col] !== "") {
                console.log("That cell is already taken!");
                return false;
            }

            board[row][col] = player;
            drawBoard();
            return true;
        },

        resetBoard: function () {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    board[i][j] = "";
                }
            }
            drawBoard();
        }
    };
})();

// Event Handlers 
boxes.forEach((box, index) => {
    box.addEventListener('click',() => {
        const row = Math.floor(index / 3);
        const col = index % 3;

        const currrentLetter = gameController.getActivePlayer();
        gameController.playTurn(row, col);

        const updatedGrid = gameBoard.getGrid();
        box.textContent = updatedGrid[row][col];
    });
});

resetBtn.addEventListener('click', () => {
    gameController.restartGame();

    boxes.forEach(box => {
        box.textContent = '';
    });
});

resetAllBtn.addEventListener('click', () => {
    gameController.resetAllGameData();

    boxes.forEach(box => {
        box.textContent = '';
    });
});

changeNamesBtn.addEventListener('click', () => {
    const inputX = prompt("Enter name for Player X:", nameXDisplay.textContent);
    const inputO = prompt("Enter name for Player O:", nameODisplay.textContent);

    gameController.setPlayerNames(inputX, inputO);
});

resetNamesBtn.addEventListener('click', () => {
    gameController.resetPlayerNames();
});