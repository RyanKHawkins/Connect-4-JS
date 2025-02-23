const slots = Array.from(document.querySelectorAll(".hole"));
const newButton = document.querySelector("#new-button");
newButton.addEventListener("click", newGame);
const player2 = { name: "Player 1", color: "red" };
const player1 = { name: "Player 2", color: "blue" };

let currPlayer = player1;
let gameWon = false

const columns = [
    { column: 1, slots: [1, 8, 15, 22, 29, 36], pieces: 0 },
    { column: 2, slots: [2, 9, 16, 23, 30, 37], pieces: 0 },
    { column: 3, slots: [3, 10, 17, 24, 31, 38], pieces: 0 },
    { column: 4, slots: [4, 11, 18, 25, 32, 39], pieces: 0 },
    { column: 5, slots: [5, 12, 19, 26, 33, 40], pieces: 0 },
    { column: 6, slots: [6, 13, 20, 27, 34, 41], pieces: 0 },
    { column: 7, slots: [7, 14, 21, 28, 35, 42], pieces: 0 }
];


function newGame() {
    slots.forEach(slot => {
        slot.dataset.color = "";
        slot.innerHTML = ""
        slot.innerText = slot.id
    })
    columns.forEach(column => {
        column.pieces = 0;
    })
    gameWon = true
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
    if (gameWon) {
        return
    }
    const chosenColumn = columns.find((col) => (col.column == column));
    if (chosenColumn.pieces >= 6) {
        console.warn("COLUMN IS FILLED");
        return
    }
    chosenColumn.pieces++;
    let filledSlots = Array.from(chosenColumn.slots.slice(-chosenColumn.pieces)).map(slot => {
        return document.getElementById(slot)
    })
    let slotID = [...chosenColumn.slots].reverse()[chosenColumn.pieces - 1]
    let chosenSlot = document.getElementById(slotID);
    chosenSlot.innerHTML = `<div class="circle ${currPlayer.color}"></div>`
    chosenSlot.dataset.color = currPlayer.color;
    checkForWin()
}

function checkForWin() {
    checkForDiagonalWin()
    checkForHorizontalWin()
    checkForVerticalWin()
}
function checkForDiagonalWin() {
    // Get upper left to lower right
    
    // Get lower left to upper right
    
}
function checkForHorizontalWin() {
    // Get each row
}
function checkForVerticalWin() {
    // Get each column
}

let idNum = 1;
slots.forEach((slot) => {
    slot.innerText = idNum;
    slot.id = idNum;
    slot.dataset.column = getColumnNum(slot);
    slot.addEventListener("click", () => {
        // slot.dataset.color = currPlayer.color;
        // slot.style.backgroundColor = currPlayer.color;
        switchPlayer();
        dropPiece(slot.dataset.column);
    });

    idNum++;
});

function displayStats() {
    
}

function isBoardFull() {
    return slots.every(slot => slot.dataset.color)
}

function isBeingUsed() {
    return slots.some(slot => slot.dataset.color)
}