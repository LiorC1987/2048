"use strict"

const gameDiv = document.querySelector(".game")
const root = document.querySelector(':root')
// Initiate boxes in the game

const count = [1,2,3,4]
const rows = count.map(_ => count.map(box => {
    const boxDiv = document.createElement("div")
    boxDiv.classList.add("box")
    return boxDiv
}))

const columns = count.map(_ => document.createElement("div"))
columns.map(column => {
    gameDiv.insertAdjacentElement("beforeend",column)
    column.classList.add("column")
});
columns.map((_, column) => rows[column].map(el => columns[column].insertAdjacentElement("beforeend",el)))

let game = [[2,"","",4],[4,"","",4],[2,"","",4],["","","",4]]
let previousMove = JSON.parse(JSON.stringify(game))
let addedBoxes = count.map(_ => count.map(_ => false))
let emptyBlocks = [];
function refresh() {
    columns.map((_, columnIndex) => rows[columnIndex].map((box, boxIndex) => game[columnIndex][boxIndex] == "" ? emptyBlocks.push([columnIndex, boxIndex]) : ""))
    const chosenEmptyBox = emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)]
    if (emptyBlocks.length > 0 && JSON.stringify(previousMove) != JSON.stringify(game)) {
        game[chosenEmptyBox[0]][chosenEmptyBox[1]] = 2
        boxPopAnimation(...chosenEmptyBox)
    }
    addedBoxes = count.map(_ => count.map(_ => false))
    emptyBlocks = []
    columns.map((_, columnIndex) => rows[columnIndex].map((box, boxIndex) => {box.textContent = game[columnIndex][boxIndex]
    switch(game[columnIndex][boxIndex]) {
        case "": box.style.backgroundColor = "white"; break;
        case 2: box.style.backgroundColor = "#F6FBFC"; break;
        case 4: box.style.backgroundColor = "#EDF7FA"; break;
        case 8: box.style.backgroundColor = "#E4F3F7"; break;
        case 16:box.style.backgroundColor = "#D3ECF3"; break;
        case 32:box.style.backgroundColor = "#C2E4EE"; break;
        case 64:box.style.backgroundColor = "#B0DCE9"; break;
        case 128:box.style.backgroundColor = "#97C3CF"; break;
        case 256:box.style.backgroundColor = "#7597A1"; break;
        case 512:box.style.backgroundColor = "#a8d9e7"; break;
        case 1024:box.style.backgroundColor = "#a8d9e7"; break;
        case 2048:box.style.backgroundColor = "#a8d9e7"; break;
    }}));
}

refresh()
function boxMoveAnimation(c,b,v,h,n) {
    console.log(v,h)
    const boxMoveHar = `${121*h*n}px`
    const boxMovVer = `${121*v*n}px`
    root.style.setProperty('--move-har', boxMoveHar);
    root.style.setProperty('--move-ver', boxMovVer);
    rows[c-1*v][(b-1*h)].classList.add("move")
    setTimeout(() => rows[c-1*v][(b-1*h)].classList.remove("move"),200)
    
}
function boxPopAnimation(c,b) {
    rows[c][b].classList.add("pop")
    setTimeout(() => rows[c][b].classList.remove("pop"),10000)
}


function checkEqualBelow(c,b,v,h) {
    if ((game[c][b] == game[c-1*v][(b-1*h)]) && game[c][b] > 0 && !addedBoxes[c-1*v][(b-1*h)]) {
        game[c][b] *= 2
        game[c-1*v][(b-1*h)] = ""
        addedBoxes[c][b] = true
    }
}

function checkEqualAbove(c,b,v,h) {
    if ((game[c][b] == game[c+1*v][b+1*h]) && game[c][b] > 0 && !addedBoxes[c+1*v][b+1*h] ) {
        game[c+1*v][(b+1*h)] *= 2
        game[c][b] = ""
        addedBoxes[c+1*v][(b+1*h)] = true
    }
}

function fillEmptySquare(c,b,v,h) {
    if ((game[c][b] == "") &&( game[c-1*v][(b-1*h)] != "")) {
            game[c][b] = game[c-1*v][(b-1*h)]
            game[c-1*v][(b-1*h)] = ""
            boxMoveAnimation(c,b,v,h,1)
    }
}
function fillTwoEmptySquares(c,b,v,h) {
    if ((game[c][b] == "") && (game[c-1*v][(b-1*h)] == "") && (game[c-2*v][(b-2*h)] != "")) {
        game[c][b] = game[c-2*v][(b-2*h)]
        game[c-2*v][(b-2*h)] = ""
        boxMoveAnimation(c,b,v,h,2)
    }
}
function fillThreeEmptySquares(c,b,v,h) {
    if ((game[c][b] == "") && (game[c-1*v][(b-1*h)] == "") && (game[c-2*v][(b-2*h)] == "") && (game[c-3*v][(b-3*h)] != "")) {
        game[c][b] = game[c-3*v][(b-3*h)]
        game[c-3*v][(b-3*h)] = ""
        boxMoveAnimation(c,b,v,h,3)
    }
}

function move(column, box, h, v) {
    let b, c, e, r, ah, av;
    h == 1 ? b = Math.abs(3-box) : b = box 
    v == 1 ? c = Math.abs(3-column) : c = column
    v ? (r=c) : (r=b);
    ((v == 1) || (h == 1)) ? (e = 3) : (e = 0)
    let e1 = Math.abs(e-1)
    let e2 = Math.abs(e-2)
    if (r == e) {
        fillEmptySquare(c,b,v,h)
        fillTwoEmptySquares(c,b,v,h)
        fillThreeEmptySquares(c,b,v,h)
        checkEqualBelow(c,b,v,h)
    }
    if (r == e1) {
        fillEmptySquare(c,b,v,h)
        fillTwoEmptySquares(c,b,v,h)
        checkEqualAbove(c,b,v,h)
        checkEqualBelow(c,b,v,h)
        fillTwoEmptySquares(c,b,v,h)
    }
    if (r == e2) {
        fillEmptySquare(c,b,v,h)
        checkEqualAbove(c,b,v,h)
        checkEqualBelow(c,b,v,h)
    }
}

function play(h, v) {
    columns.map((_, column) => rows[column].map((_, box) => move(column, box, h, v)));
    setTimeout(() => refresh(),200)
}
document.addEventListener('keydown', (event) => {
    previousMove = JSON.parse(JSON.stringify(game))
    switch (event.key) {
        case 'ArrowUp':
            play(0, -1)
            // columns.map((_, column) => rows[column].map((_, box) => move(column, box, 0, -1)));
            // refresh()
          break;
        case 'ArrowDown':
            play(0, 1)
            // columns.map((_, column) => rows[column].map((_, box) => move(column, box, 0, 1)));
            // refresh()
            break;
        case 'ArrowLeft':
            play(-1, 0)
            // columns.map((_, column) => rows[column].map((_, box) => move(column, box, -1, 0)));
            // refresh()
          break;
        case 'ArrowRight':
            play(1, 0)
            // columns.map((_, column) => rows[column].map((_, box) => move(column, box, 1, 0)));
            // refresh()
          break;
      }});


  // function move(ci, bi, h, v) {
//     let b, c;
//     let e;
//     let r;
//     let ah, av;
//     ah = Math.abs(h)
//     av = Math.abs(v)
//     if (h == 1) {b = Math.abs(3-bi)} else {b = bi} 
//     if (v == 1) {c = Math.abs(3-ci)} else {c = ci}
//     v ? (r=c) : (r=b);
//     ((v == 1) || (h = 1)) ? (e = 3) : (e = 0)
//     if (r == e) return;
//     if (game[c+v*1][b+h*1] == "") {
//         game[c+v*1][b+h*1] = game[c][b]
//         game[c][b] = ""
//         addedBoxes[c][b] ? (addedBoxes[c+v*1][b+h*1] = true) : ""
//         console.log(game[0][1])
//     } 
//     let n = Math.abs(e-1)
//     let n2 = Math.abs(e-2)
//     if (game[c][b] == "" && (r != (3-e))) {
//         game[c][b] = game[c-v*1][b-h*1]
//         game[c-v*1][b-h*1] = ""
//         addedBoxes[c-v*1][b-h*1] ? (addedBoxes[c][b] = true) : ""
//         console.log(game[0][1])
//     }

//     if ((r==(n)) && (game[c*ah+(0+e)*av][(0+e)*ah+b*av] == game[c*ah+n*av][n*ah+b*av]) && (game[c*ah+n*av][n*ah+b*av] > 0) && !addedBoxes[c*ah+n*av][n*ah+b*av]) {
//         game[c*ah+(0+e)*av][(0+e)*ah+b*av] *= 2
//         game[c*ah+n*av][n*ah+b*av] = ""
//         addedBoxes[c*ah+n*av][n*ah+b*av] = true
//         console.log(game[0][1])
//     }
//     if ((game[c+v*1][b+h*1] == game[c][b]) && (game[c][b] > 0) && !addedBoxes[c][b]) {
//         game[c+v*1][b+h*1] *= 2
//         game[c][b] = ""
//         addedBoxes[c+v*1][b+h*1] = true
//         console.log(game[0][1])
//     }
//     if ((r==(n2)) && (game[c*ah+n2*av][n2*ah+b*av] == "")) {
//         game[c*ah+n2*av][n2*ah+b*av] = game[c*ah + (3-e)*av][(3-e)*ah + b*av]
//         game[c*ah + (3-e)*av][(3-e)*ah + b*av] = ""
//         addedBoxes[c*ah + (3-e)*av][(3-e)*ah + b*av] ? (addedBoxes[c*ah+n2*av][n2*ah+b*av] = true) : ""
//         console.log(game[0][1])
//     }
//     if ((r==(n2)) && (game[c*ah+n*av][n*ah+b*av] == "")) {
//         game[c*ah+n*av][n*ah+b*av] = game[c*ah+n2*av][n2*ah+b*av]
//         game[c*ah+n2*av][n2*ah+b*av] = ""
//         addedBoxes[c*ah+n2*av][n2*ah+b*av] ? (addedBoxes[c*ah+n*av][n*ah+b*av] = true) : ""
//         console.log(game[0][1])
//     }
//     console.log(r, c, b, e)
// }

// function moveUpDown(ci, b, d) {
//     let c;
//     let e;
//     (d == 1) ? (e = 3) : (e = 0)
//     if (d==1) {c = ci} else {c = Math.abs(3-ci)}
//     if (c == e) return;
//     if (game[c+d*1][b] == "") {
//         game[c+d*1][b] = game[c][b]
//         game[c][b] = ""
//         addedBoxes[c][b] ? (addedBoxes[c+d*1][b] = true) : ""
//     } 
//     let n = Math.abs(e-1)
//     let n2 = Math.abs(e-2)
//     if (game[c][b] == "" && (c != (3-e))) {
//         game[c][b] = game[c-d*1][b]
//         game[c-d*1][b] = ""
//     }
//     if ((game[c+d*1][b] == game[c][b]) && (game[c][b] > 0) && !addedBoxes[c][b]) {
//         game[c+d*1][b] *= 2
//         game[c][b] = ""
//         addedBoxes[c+d*1][b] = true
//     }
//     if ((c==(n)) && (game[n2][b] == "")) {
//         game[n2][b] = game[3-e][b]
//         game[3-e][b] = ""
//     }
//     if ((c==(n)) && (game[n][b] == "")) {
//         game[n][b] = game[n2][b]
//         game[n2][b] = ""
//     }
//     if ((c==(n)) && (game[0+e][b] == game[n][b]) && (game[n][b] > 0) && !addedBoxes[n][b]) {
//         game[0+e][b] *= 2
//         game[n][b] = ""
//         addedBoxes[n][b] = true
//     }
// }