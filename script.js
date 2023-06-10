//DOM
const header = document.getElementById("header")
const container = document.getElementById("container")
const gameMenu  = document.getElementById("menu")
const rulesMenu = document.getElementById('menu-rules');
const playBtn = document.getElementById("play-btn")
const imgs = document.getElementById("imgs")
const startIMG = document.getElementById("start")
const middleIMG = document.getElementById("middle")
const endIMG = document.getElementById("end")
//Buttons
const btnRight = document.getElementById("btn-right")
const btnLeft = document.getElementById("btn-left")
const btnUp = document.getElementById("btn-up")
const btnDown = document.getElementById("btn-down")
const btnRestart = document.getElementById("btn-restart")
const radioButtons = document.getElementsByName('radio');

let blocks = 400;
let interval = 100;
let apple = randomPosition();
let fly = 399;
let runningGame = 0
let mode = "game"

function getSelectedRadio() {
    for (let radio of radioButtons) {
        if (radio.checked) {
            mode = radio.value;
        }
    }
}

function animation() {
    startIMG.classList.add("hidden")
    middleIMG.classList.remove("hidden")
    setTimeout(() => {
        middleIMG.classList.add('hidden')
        endIMG.classList.remove("hidden")
        endIMG.classList.add('animation')
    }, 400);
    
}

function startGame() {
    animation()
    if (mode === "game") {
       worm.changeBody([0,1,2])
    }
    setTimeout(() => {
        container.classList.remove("hidden")
        playBtn.classList.add("hidden")
        gameMenu.classList.add("hidden")
        rulesMenu.classList.add("hidden")
        runningGame = setInterval(`${mode}()`, interval);
    }, 2000);
}

function restart() {
    clearInterval(runningGame)
    runningGame = setInterval(game, interval);
}


const rules = {
    collision: true, 
    collisionSelf: true,
    collisionBorders: true,
}

const player = (name, body, direction) => {
    let points = 0;

    const changeBody = (newBody) => body.splice(0, body.length, ...newBody);;
    const addPoint = () => points++;
    const getPoints = () => points;
    const getDirection = () => direction;
    const changeDirection = (newDirection) => direction = newDirection; 
    const getName = () => name;
    const getLength = () => body.length;
    const getHead = () => Number(body.slice(-1));

    const move = () => {
        let nextMove = "";
        switch (direction) {
            case "right":
                nextMove = (getHead() > 398 ? getHead() - 19: getHead() + 1);
                break
            case "left":
                nextMove = (getHead() < 1 ? getHead() + 19: getHead() - 1);
                break
            case "up":
                nextMove = (getHead() < 20 ? getHead() + 380: getHead() - 20);
                break;
            case "down":
                nextMove = (getHead() > 379 ? getHead() - 380: getHead() + 20);
                break
        }
        body.push(nextMove)
        if (checkAppleEat() !== true) {
            body.shift()
        }
        
    }
    
    const movePc = () => {
        body.push(movePC(getHead))
        body.shift
    }

    return { body, getDirection, addPoint, getPoints, changeDirection, move, getName, getLength, getHead, movePc, changeBody }
}

const worm = player("worm", [0, 1, 2, 3, 4, 5, 6 ,7 ,8, 9], "right");
const snake = player("snake", [399, 398, 397, 396, 395, 394, 393, 392, 391, 390], "left");

function randomPosition() {return Number.parseInt(Math.random() * 399) }

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
    if (snake.getDirection()!== "left" && key === "d") {
        snake.changeDirection("right")
    } else if ( snake.getDirection() !== "right" && key === "a") {
        snake.changeDirection("left")
    } else if ( snake.getDirection() !== "up" && key === "s") {
        snake.changeDirection("down")
    } else if ( snake.getDirection() !== "down" && key === "w")  {
        snake.changeDirection("up")
    }
        
}

function checkLose(player) {
    if (checkCollisionBorders(player)){
        alert("chocaste")
    }
    // if (nextBox > 399 || nextBox < 0) {
    //     interval = 0
    //     count++
    //     clearInterval(runningGame)
    // } 
    
    // worm.body.forEach((box) => {
    //     if(box === nextBox) {
    //         count++
    //         clearInterval(myInterval)
    //     }
    // })

}

function checkCollisionBorders(player) {
    
    if (player.getDirection() === "up" && player.getHead() > 300 && player.body[player.getLength() - 2] < 20) {
        return true
    }

    if (player.getDirection() === "down" && player.getHead() < 20 && player.body[player.getLength() - 2] > 300) {
        return true
    }

    if (player.getDirection() === "right") {
        let extreme = 20
        for (let i = 0; i < 20; i++) {
            if (player.getHead() === extreme) {
                return true
            }
            extreme += 20
        }
        
    }

    if (player.getDirection() === "left") {
        let extreme = 19
        for (let i = 0; i < 20; i++) {
            if (player.getHead() === extreme) {
                return true
            }
            extreme += 20
        }
    }
}

function checkAppleEat() {
    if (fly === apple) {
        apple = randomPosition()
        return;
    }
    if (worm.getHead() === apple) {
        apple = randomPosition()
        worm.addPoint()
        return true;
    }
}

function checkAppleEatMP() {
    if (fly === apple) {
        apple = randomPosition()
        return;
    }
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
    

    worm.move()
    fly = movePC(fly);
    checkAppleEat()
    
    printPlayer(worm)
    printFly()
    printApple()
}

function multiplayerGame() {
    printTable()

    worm.move();
    snake.move();
    fly = movePC(fly);
    checkAppleEatMP();
    checkLose(worm);
    checkLose(snake);

    printApple()
    printFly()
    printPlayer(worm)
    printPlayer(snake)
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

btnRight.addEventListener("click", changeDirection)
btnLeft.addEventListener("click", changeDirection)
btnUp.addEventListener("click", changeDirection)
btnDown.addEventListener("click", changeDirection)
btnRestart.addEventListener("click", restart)
menu.addEventListener("click", getSelectedRadio)

//Keyboard handle
document.addEventListener("keydown", (e) => {
    e = e || window.event
    changeDirection(e.key)
    console.log(e.key)
})
