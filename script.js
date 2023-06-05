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
let body = [3, 4, 5]
let direction = "right"
let interval = 100
let apple = Number.parseInt(Math.random() * 399)
let fly = 399
let points = 0

function printTable() {
    container.innerHTML = ""
    for (let i = 0; i < blocks; i++) {
        let div = document.createElement("div");
        div.id = i
        container.appendChild(div);
    }
}

function printWorm() {
    for (let i = 0; i < body.length; i++) {
        document.getElementById(body[i]).classList.add("wormBody")  
    }
    document.getElementById(body[body.length -1 ]).classList.add("wormHead")
}

function printApple() {
    document.getElementById(apple).classList.add("apple")
}

function printFly() {
    document.getElementById(fly).classList.add("fly")
}

function changeDirection(e) {
    if (direction !== "left" && e.key === "ArrowRight" || this.id === "btn-right" ) {
        direction = "right"
    } else if ( direction !== "right" && e.key === "ArrowLeft" || this.id === "btn-left" ) {
        direction = "left"
    } else if ( direction !== "up" && e.key === "ArrowDown" || this.id === "btn-down"  ) {
        direction = "down"
    } else if ( direction !== "down" && e.key === "ArrowUp" || this.id === "btn-up" )  {
        direction = "up"
    }
        
}

function checklose(nextBox, lastIndex) {
    let count = 0;
    if (nextBox > 399 || nextBox < 0) {
        interval = 0
        count++
        clearInterval(myInterval)
    } 
    
    body.forEach((box) => {
        if(box === nextBox) {
            count++
            clearInterval(myInterval)
        }
    })

    if (direction === "right") {
       
        let extreme = 19
        for (let i = 0; i < 20; i++) {
            if (body[lastIndex] === extreme) {
                count++
                clearInterval(myInterval)
            }
            extreme += 20
        }
        
    }

    if (direction === "left") {
       
        let extreme = 20
        for (let i = 0; i < 20; i++) {
            if (body[lastIndex] === extreme) {
                count++
                clearInterval(myInterval)
            }
            extreme += 20
        }
        
    }

    return count > 0 ? true: false
}

function checkAppleEat(nextBox) {
    if (fly === apple) {
        apple = Number.parseInt(Math.random() * 399)
        body.shift()
        return
    }
    if (nextBox === apple) {
        apple = Number.parseInt(Math.random() * 399)
        points++
        header.textContent = "You've got " + points + " points"
        return 
    }
    body.shift()
}

function getDirection(lastIndex) {
    if (direction === "right") {
        return body[lastIndex] + 1
    } else if (direction === "left") {
        return body[lastIndex] - 1
    } else if (direction === "down") {
        return body[lastIndex] + 20
    } else {
        return body[lastIndex] - 20
    }
}


function move() {
    let lastIndex = body.length - 1
    let nextBox = getDirection(lastIndex)
    if  (checklose(nextBox, lastIndex)) {
        alert("You lose")
        return
    }
    
    body.push(nextBox)
    moveFly(lastIndex)
    checkAppleEat(nextBox)
    printTable();
    printWorm();
    printApple()
    printFly()
}

function moveFly() {
    if (apple < fly) {
        if ((fly - apple) > 15) {
            fly -= 20
        } else {
            fly -= 1
        }
    }
    if (apple > fly) {
        if ((apple - fly) > 15) {
            fly += 20
        } else {
            fly += 1
        }
    }
}

let myInterval = ""

function restart() {
    body = [4, 5, 6]
    direction = "right"
    interval = 100
    apple = Number.parseInt(Math.random() * 399)
    fly = 399
    points = 0
    myInterval = setInterval(move, interval);
}

myInterval = setInterval(move, interval);

printTable()
printWorm()
printApple()
printFly()
btnRight.addEventListener("click", changeDirection)
btnLeft.addEventListener("click", changeDirection)
btnUp.addEventListener("click", changeDirection)
btnDown.addEventListener("click", changeDirection)
btnRestart.addEventListener("click", restart)

//Keyboard handle
document.addEventListener("keydown", (e) => {
    e = e || window.event
    changeDirection(e)
})