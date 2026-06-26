/*
Tasks:
    - Draw game board.
    - Create Players.
    - Update game board.
    - Check for winner.
    - End of game message.
    - Run through game.

Objects:
    * Gameboard
    * Players
    * Game

*/

// DOM Elements

// Objects
const gameController = (function() {
    const playerX = "X";
    const playerO = "O";
    let activePlayer = playerX;
    let isGameOver = false;

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

    function switchTurn () {
        activePlayer = activePlayer === playerX ? playerO : playerX;
        console.log(`It is now ${activePlayer}'s turn.`);
    }

    return {
        playTurn: function(row, col) {
            if (isGameOver) {
                console.log("Game over.");
                return;
            }

            const moveSuccessful = gameBoard.makeMove(row,col,activePlayer);

            if (moveSuccessful){
                const currentBoard = gameBoard.getGrid();

                if (checkWin(currentBoard)) {
                    console.log(`🥳🥳🥳 Player ${activePlayer} wins!!!`);
                    isGameOver = true;
                    return;
                }

                if (checkTie(currentBoard)) {
                    console.log("It's a tie.");
                    isGameOver = true;
                    return;
                }

                activePlayer = activePlayer === playerX ? playerO : playerX;
                console.log(`It's now ${activePlayer}'s turn.`);
            }
        },

    restartGame: function () {
        activePlayer = playerX;
        isGameOver = false;
        gameBoard.resetBoard();
        console.log("Game reset. Player X turn.");
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

// Functions 

// Event Handlers 