const slots = Array.from(document.querySelectorAll(".hole"));
const newButton = document.querySelector("#new-button");
newButton.addEventListener("click", newGame);
const player1 = { name: "Player 1", color: "red" };
const player2 = { name: "Player 2", color: "blue" };
const root = document.documentElement;

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
        red: 0,
        blue: 0,
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
    root.style.setProperty("--player-color", currPlayer.color);
    document.querySelector("#blue-piece").classList.toggle("curr-player");
    document.querySelector("#red-piece").classList.toggle("curr-player");
    root.style.setProperty("--player-color", currPlayer == player1 ? "var(--red)" : "var(--blue");
}


function getColumnNum(slot) {
    return columns.find((c) => c.slots.includes(Number(slot.id))).column;
}

function showDrop(column, slot) {
    let emptySlotIDs = [...column.slots].reverse().slice(column.pieces).reverse();
    console.log(emptySlotIDs)
    console.log(slot)
    let count = 0;

    setInterval(() => {
        if (count >= emptySlotIDs.length) {
            return
        }
        console.log("count: ", count);
        let slotElement = document.getElementById(emptySlotIDs[count]);
        slotElement.innerHTML = `<div class="circle ${currPlayer.color}"></div>`
        count++;
        setTimeout(() => {slotElement.innerHTML = ""}, 50)
        if (count < emptySlotIDs.length) {
            setTimeout(() => {
                document.getElementById(slot).innerHTML = `<div class="circle ${currPlayer. color}"></div>`

            }, 250)
        }
    }, 50)
    console.log("Empty slot IDs:  ", emptySlotIDs)
    console.log("chosen slot:  ", slot)
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
    chosenColumn.pieces++;
    let slotID = [...chosenColumn.slots].reverse()[chosenColumn.pieces - 1];
    let chosenSlot = document.getElementById(slotID);
    // showDrop(chosenColumn, slotID);
    chosenSlot.innerHTML = `<div class="circle ${currPlayer.color}"></div>`
    chosenSlot.dataset.color = currPlayer.color;
    if (checkForWin() || isBoardFull()) {
        gameOver = true;
        if (checkForWin()) {
            winner = currPlayer.name;
            console.log(`${winner} won!`);
            incrementStatsDictStat(currPlayer == player1 ? "red" : "blue")
        }

    }
    switchPlayer();
    if (isBoardFull() && !checkForWin()) {
        incrementStatsDictStat("ties");
        // statsDict = JSON.parse(localStorage.getItem("Connect-4-JS.statsDict"))
        // statsDict.ties++;
        // console.log(statsDict)
        // localStorage.setItem("Connect-4-JS.statsDict", JSON.stringify(statsDict))
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
                setTimeout(() => {
                    rowSection.forEach(slot => slot.classList.add("winning-pieces"));                    
                }, 250)

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
                setTimeout(() => {
                    columnSection.forEach(slot => slot.classList.add("winning-pieces"))                    
                }, 250)

                return true
            }
        }
    }
}


function incrementStatsDictStat(stat) {
    statsDict = JSON.parse(localStorage.getItem("Connect-4-JS.statsDict"))
    statsDict[stat]++;
    console.log(`updated ${stat}`);
    console.log(statsDict)
    localStorage.setItem("Connect-4-JS.statsDict", JSON.stringify(statsDict))
}

function resetStatsDict() {
    localStorage.removeItem("Connect-4-JS.statsDict");
    console.log("resetting win stats");
    statsDict = {
        red: 0,
        blue: 0,
        ties: 0
    }
    localStorage.setItem("Connect-4-JS.statsDict", JSON.stringify(statsDict));
    console.log(localStorage.getItem("Connect-4-JS.statsDict"))
}

function displayStats() {
    
}

function isBoardFull() {
    return slots.every(slot => slot.dataset.color)
}
