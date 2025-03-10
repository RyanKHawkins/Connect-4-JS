const slots = Array.from(document.querySelectorAll(".hole"));
const newButton = document.querySelector("#new-button");
newButton.addEventListener("click", newGame);
const player2 = { name: "Player 1", color: "red" };
const player1 = { name: "Player 2", color: "blue" };

let currPlayer = player1;
let gameOver = false
let winner = ""


const columns = [
    { column: 1, slots: [1, 8, 15, 22, 29, 36], pieces: 0 },
    { column: 2, slots: [2, 9, 16, 23, 30, 37], pieces: 0 },
    { column: 3, slots: [3, 10, 17, 24, 31, 38], pieces: 0 },
    { column: 4, slots: [4, 11, 18, 25, 32, 39], pieces: 0 },
    { column: 5, slots: [5, 12, 19, 26, 33, 40], pieces: 0 },
    { column: 6, slots: [6, 13, 20, 27, 34, 41], pieces: 0 },
    { column: 7, slots: [7, 14, 21, 28, 35, 42], pieces: 0 }
];

let idNum = 1;
slots.forEach((slot) => {
    slot.innerText = idNum;
    slot.id = idNum;
    slot.dataset.column = getColumnNum(slot);
    slot.addEventListener("click", () => {
        dropPiece(slot.dataset.column);
    });

    idNum++;
});

let statsDict = JSON.parse(localStorage.getItem("Connect-4-JS.statsDict")) || {
        redWins: 0,
        blueWins: 0,
        ties: 0
    }
localStorage.setItem("Connect-4-JS.statsDict", JSON.stringify(statsDict))


function newGame() {
    slots.forEach(slot => {
        slot.dataset.color = "";
        slot.innerHTML = ""
        slot.innerText = slot.id
        slot.classList = "hole"
    })
    columns.forEach(column => {
        column.pieces = 0;
    })
    winner = ""
    gameOver = false
}

function switchPlayer() {
    currPlayer = currPlayer == player1 ? player2 : player1;
    document.querySelector("#blue-piece").classList.toggle("curr-player")
    document.querySelector("#red-piece").classList.toggle("curr-player")
}


function getColumnNum(slot) {
    return columns.find((c) => c.slots.includes(Number(slot.id))).column;
}

function dropPiece(column) {
    if (gameOver) {
        return
    }
    const chosenColumn = columns.find((col) => (col.column == column));
    if (chosenColumn.pieces >= 6) {
        console.warn("COLUMN IS FILLED");
        return
    }
    switchPlayer();
    chosenColumn.pieces++;
    let slotID = [...chosenColumn.slots].reverse()[chosenColumn.pieces - 1];
    let chosenSlot = document.getElementById(slotID);
    chosenSlot.innerHTML = `<div class="circle ${currPlayer.color}"></div>`
    chosenSlot.dataset.color = currPlayer.color;
    if (checkForWin() || isBoardFull()) {
        gameOver = true;
        if (checkForWin()) {
            winner = currPlayer.name;
            console.log(`${winner} won!`)            
        }

    }
    if (isBoardFull() && !checkForWin()) {
        statsDict = JSON.parse(localStorage.getItem("Connect-4-JS.statsDict"))
        statsDict.ties++;
        console.log(statsDict)
        localStorage.setItem("Connect-4-JS.statsDict", JSON.stringify(statsDict))
    }
}

function checkForWin() {
    // checkForDiagonalWin()
    checkForHorizontalWin()
    checkForVerticalWin()
    return checkForVerticalWin() || checkForHorizontalWin()
}
function checkForHorizontalWin() {
    // Get each row
    let columnsArray = columns.map(column => column.slots);
    let rows = [];
    for (let i = 0; i <= 5; i++) {
        let row = [];
        for (let j = 0; j < columnsArray.length; j++) {
            row.push(columnsArray[j][i])
        }
        rows.push(row);
    }
    for (const row of rows) {
        for (let i = 0; i < 4; i++) {
            let rowSection = row.slice(i, i + 4);
            rowSection = rowSection.map(slot => document.getElementById(slot));
            if (rowSection.every(slot => slot.dataset.color && slot.dataset.color == rowSection[0].dataset.color)) {
                rowSection.forEach(slot => slot.classList.add("winning-pieces"));
                return true
            }
        }
    }

}
function checkForDiagonalWin() {
    // Get upper left to lower right
    
    // Get lower left to upper right
    
}

function checkForVerticalWin() {
    for (const column of columns) {
        for (let i = 0; i < 3; i++) {
            let columnSection = column.slots.slice(i, i + 4);
            columnSection = columnSection.map(slot => document.getElementById(slot));
            if (columnSection.every(slot => slot.dataset.color && slot.dataset.color == columnSection[0].dataset.color)) {
                columnSection.forEach(slot => slot.classList.add("winning-pieces"))
                return true
            }
        }
    }
}


function displayStats() {
    
}

function isBoardFull() {
    return slots.every(slot => slot.dataset.color)
}
