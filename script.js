//DOM
const header = document.getElementById("header")
const container = document.getElementById("container")
//Buttons
const btnRight = document.getElementById("btn-right")
const btnLeft = document.getElementById("btn-left")
const btnUp = document.getElementById("btn-up")
const btnDown = document.getElementById("btn-down")
const btnRestart = document.getElementById("btn-restart")

let blocks = 400;
let interval = 100
let apple = randomPosition()
let fly = 399

function randomPosition() {return Number.parseInt(Math.random() * 399) }

const rules = {
    collision: true, 
    collisionSelf: true,
    collisionBorders: true
}

const player = (name, body, direction) => {
    let points = 0;

    const addPoint = () => points++;
    const getPoints = () => points;
    const getDirection = () => direction;
    const changeDirection = (newDirection) => direction = newDirection; 
    const getName = () => name;
    const getLength = () => body.length;
    const getHead = () => Number(body.slice(-1))

    const move = () => {
        let nextMove = "";
        switch (direction) {
            case "right":
                nextMove = getHead() +  1
                break
            case "left":
                nextMove = getHead() - 1;
                break
            case "up":
                nextMove = getHead() - 20;
                break;
            case "down":
                nextMove = getHead() + 20;
                break
        }
        body.push(nextMove)
        body.shift()
    }
    
    const movePc = () => {
        body.push(movePC(getHead))
        body.shift
    }

    return { body, getDirection, addPoint, getPoints, changeDirection, move, getName, getLength, getHead, movePc }
}

const worm = player("worm", [0, 1, 2, 3, 4, 5, 6 ,7 ,8, 9], "right");
const snake = player("snake", [399, 398, 397, 396, 395, 394, 393, 392, 391, 390], "left");

function printTable() {
    container.innerHTML = ""
    for (let i = 0; i < blocks; i++) {
        let div = document.createElement("div");
        div.id = i
        container.appendChild(div);
    }
}

function printPlayer(player) {
    for (let i = 0; i < player.getLength(); i++) {
        document.getElementById(player.body[i]).classList.add(`${player.getName()}Body`)  
    }
    document.getElementById(player.getHead()).classList.add(`${player.getName()}Head`)
}


function printApple() {
    document.getElementById(apple).classList.add("apple")
}

function printFly() {
    document.getElementById(fly).classList.add("fly")
}

function changeDirection(key) {
    if (worm.getDirection() !== "left" && key === "ArrowRight" || this.id === "btn-right" ) {
        worm.changeDirection("right")
    } else if (worm.getDirection() !== "right" && key === "ArrowLeft" || this.id === "btn-left" ) {
        worm.changeDirection("left")
    } else if ( worm.getDirection() !== "up" && key === "ArrowDown" || this.id === "btn-down"  ) {
        worm.changeDirection("down")
    } else if ( worm.getDirection() !== "down" && key === "ArrowUp" || this.id === "btn-up" )  {
        worm.changeDirection("up")
    }
    if (snake.getDirection()!== "left" && key === "d" || this.id === "btn-right" ) {
        snake.changeDirection("right")
    } else if ( snake.getDirection() !== "right" && key === "a" || this.id === "btn-left" ) {
        snake.changeDirection("left")
    } else if ( snake.getDirection() !== "up" && key === "s" || this.id === "btn-down"  ) {
        snake.changeDirection("down")
    } else if ( snake.getDirection() !== "down" && key === "w" || this.id === "btn-up" )  {
        snake.changeDirection("up")
    }
        
}

// function checkLose(nextBox, lastIndex) {
//     let count = 0;
//     if (nextBox > 399 || nextBox < 0) {
//         interval = 0
//         count++
//         clearInterval(myInterval)
//     } 
    
//     worm.body.forEach((box) => {
//         if(box === nextBox) {
//             count++
//             clearInterval(myInterval)
//         }
//     })

//     if (direction === "right") {
//         let extreme = 19
//         for (let i = 0; i < 20; i++) {
//             if (worm.body[lastIndex] === extreme) {
//                 count++
//                 clearInterval(myInterval)
//             }
//             extreme += 20
//         }
        
//     }

//     if (direction === "left") {
//         let extreme = 20
//         for (let i = 0; i < 20; i++) {
//             if (worm.body[lastIndex] === extreme) {
//                 count++
//                 clearInterval(myInterval)
//             }
//             extreme += 20
//         }
        
//     }

//     return count > 0 ? true: false
// }

function checkAppleEat(nextBox) {
    if (fly === apple) {
        apple = randomPosition()
        worm.body.shift()
        return
    }
    if (nextBox === apple) {
        apple = randomPosition()
        points++
        header.textContent = "You've got " + points + " points"
        return 
    }
    worm.body.shift()
}

function checkAppleEatMultiplayer() {
    if (worm.getHead() === apple) {
        apple = randomPosition()
        snake.body.shift();
        return;
    }
    if (snake.getHead() === apple) {
        worm.body.shift();
        apple = randomPosition()
        return;
    }
}



function game() {
    printTable();
    printPlayer(worm)

    worm.move()

    moveFly()   
    
    printApple()
    printFly()
}

function multiplayerGame() {
    printTable()

    printPlayer(worm)
    printPlayer(snake)

    worm.move()
    snake.move()

    printApple()
    checkAppleEatMultiplayer()

    header.textContent = `Worm lives: ${worm.getLength()} Snake lives: ${snake.getLength()}`
}

function multiplayerGamePc() {
    printTable()

    printPlayer(worm)
    printPlayer(snake)

    worm.move()
    

    printApple()
    checkAppleEatMultiplayer()

    header.textContent = `Worm lives: ${worm.getLength()} Snake lives: ${snake.getLength()}`
}



function movePC(pc) {
    if (apple < pc) {
        if ((pc - apple) > 15) {
            pc -= 20
        } else {
            pc -= 1
        }
    }
    if (apple > pc) {
        if ((apple - fly) > 15) {
            pc += 20
        } else {
            pc += 1
        }
    }
    return pc
}

let myInterval = ""

function restart() {
    clearInterval(myInterval)
    myInterval = setInterval(game, interval);
}

myInterval = setInterval(multiplayerGame, interval);


btnRight.addEventListener("click", changeDirection)
btnLeft.addEventListener("click", changeDirection)
btnUp.addEventListener("click", changeDirection)
btnDown.addEventListener("click", changeDirection)
btnRestart.addEventListener("click", restart)

//Keyboard handle
document.addEventListener("keydown", (e) => {
    e = e || window.event
    changeDirection(e.key)
    console.log(e.key)
})

