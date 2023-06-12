//DOM
const title = document.getElementById("title");
const score = document.getElementById("score");
const container = document.getElementById("container");
const gameMenu = document.getElementById("menu");
const rulesMenu = document.getElementById("menu-rules");
const playBtn = document.getElementById("play-btn");
const imgs = document.getElementById("imgs");
const startIMG = document.getElementById("start");
const middleIMG = document.getElementById("middle");
const endIMG = document.getElementById("end");
//Buttons
const btnRestart = document.getElementById("btn-restart");
const radioButtons = document.getElementsByName("radio");
const checkButtons = document.getElementsByName("checkbox");
//Player buttons
const btnRight = document.getElementById("btn-right");
const btnLeft = document.getElementById("btn-left");
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");

const rules = {
    fly: false,
    collision: false,
    collisionSelf: false,
    collisionBorders: false,
};

const UP = "up";
const DOWN = "down";
const RIGHT = "right";
const LEFT = "left";
const WORM = "worm";
const SNAKE = "snake";
const HIDDEN = "hidden";

const BLOCKS = 400;
let interval = 100;
let apple = randomPosition();
let fly = 399;
let runningGame = 0;
let mode = "game";

function changeGameMode() {
    for (let radio of radioButtons) {
        if (radio.checked) {
            mode = radio.value;
        }
    }
}

function changeRules() {
    for (checkbox of checkButtons) {
        rules[checkbox.id] = checkbox.checked;
    }
}

function animation() {
    startIMG.classList.add(HIDDEN);
    middleIMG.classList.remove(HIDDEN);
    setTimeout(() => {
        middleIMG.classList.add(HIDDEN);
        endIMG.classList.remove(HIDDEN);
        endIMG.classList.add("animation");
    }, 50);
}

function startGame() {
    animation();
    if (mode === "game") {
        worm.changeBody([0, 1, 2]);
    }
    setTimeout(() => {
        container.classList.remove(HIDDEN);
        title.classList.add(HIDDEN);
        playBtn.classList.add(HIDDEN);
        gameMenu.classList.add(HIDDEN);
        rulesMenu.classList.add(HIDDEN);
        runningGame = setInterval(`${mode}()`, interval);
    }, 2000);
}

function restart() {
    clearInterval(runningGame);
    runningGame = setInterval(game, interval);
}

const player = (name, body, direction) => {
    let points = 0;

    const changeBody = (newBody) => body.splice(0, body.length, ...newBody);
    const addPoint = () => points++;
    const getPoints = () => points;
    const getDirection = () => direction;
    const changeDirection = (newDirection) => (direction = newDirection);
    const getName = () => name;
    const getLength = () => body.length;
    const getHead = () => Number(body.slice(-1));

    const move = () => {
        let nextMove = "";
        switch (direction) {
            case RIGHT:
                nextMove = getHead() > 398 ? getHead() - 19 : getHead() + 1;
                break;
            case LEFT:
                nextMove = getHead() < 1 ? getHead() + 19 : getHead() - 1;
                break;
            case UP:
                nextMove = getHead() < 20 ? getHead() + 380 : getHead() - 20;
                break;
            case DOWN:
                nextMove = getHead() > 379 ? getHead() - 380 : getHead() + 20;
                break;
        }
        body.push(nextMove);
        if (mode === "multiplayerGame") {
            body.shift();
        }
        if (mode === "game" && checkAppleEat() !== true) {
            body.shift();
        }
    };

    const movePc = () => {
        body.push(movePC(getHead));
        body.shift;
    };

    return {
        body,
        getDirection,
        addPoint,
        getPoints,
        changeDirection,
        move,
        getName,
        getLength,
        getHead,
        movePc,
        changeBody,
    };
};

const worm = player(WORM, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], RIGHT);
const snake = player(
    SNAKE,
    [399, 398, 397, 396, 395, 394, 393, 392, 391, 390],
    LEFT
);

function randomPosition() {
    return Number.parseInt(Math.random() * 399);
}

function printScore() {
    if (mode === "game") {
        score.innerHTML = `<h2>Worm points: ${worm.getPoints()}</h2>`;
        return;
    }
    score.innerHTML = `<h2>Worm lives: ${worm.getLength()}</h2><h2> Snake lives: ${snake.getLength()}</h2>`;
}

function printTable() {
    container.innerHTML = "";
    for (let i = 0; i < BLOCKS; i++) {
        let div = document.createElement("div");
        div.id = i;
        container.appendChild(div);
    }
}

function printPlayer(player) {
    for (let i = 0; i < player.getLength(); i++) {
        document
            .getElementById(player.body[i])
            .classList.add(`${player.getName()}Body`);
    }
    document
        .getElementById(player.getHead())
        .classList.add(`${player.getName()}Head`);
}

function printApple() {
    document.getElementById(apple).classList.add("apple");
}

function printFly() {
    document.getElementById(fly).classList.add("fly");
}

function changeDirection(key) {
    if (
        (worm.getDirection() !== LEFT && key === "ArrowRight") ||
        this.id === "btn-right"
    ) {
        worm.changeDirection(RIGHT);
    } else if (
        (worm.getDirection() !== RIGHT && key === "ArrowLeft") ||
        this.id === "btn-left"
    ) {
        worm.changeDirection(LEFT);
    } else if (
        (worm.getDirection() !== UP && key === "ArrowDown") ||
        this.id === "btn-down"
    ) {
        worm.changeDirection(DOWN);
    } else if (
        (worm.getDirection() !== DOWN && key === "ArrowUp") ||
        this.id === "btn-up"
    ) {
        worm.changeDirection(UP);
    }
    if (snake.getDirection() !== LEFT && key === "d") {
        snake.changeDirection(RIGHT);
    } else if (snake.getDirection() !== RIGHT && key === "a") {
        snake.changeDirection(LEFT);
    } else if (snake.getDirection() !== UP && key === "s") {
        snake.changeDirection(DOWN);
    } else if (snake.getDirection() !== DOWN && key === "w") {
        snake.changeDirection(UP);
    }
}

function checkLose(player) {
    if (checkCollisionBorders(player)) {
        alert("You die");
    }
    if (checkCollision(player)) {
        alert("You eat enemy");
    }
}

function checkCollision(player) {
    if (!rules.collision) {
        return
    }
    if (player.getName() === WORM) {
        return worm.body.some((body) => body === snake.getHead());
    } else {
        return snake.body.some((body) => body === worm.getHead());
    }
}

function checkCollisionBorders(player) {
    if (!rules.collisionBorders) {
        return
    }
    if (
        player.getDirection() === UP &&
        player.getHead() > 300 &&
        player.body[player.getLength() - 2] < 20
    ) {
        return true;
    }

    if (
        player.getDirection() === DOWN &&
        player.getHead() < 20 &&
        player.body[player.getLength() - 2] > 300
    ) {
        return true;
    }

    if (player.getDirection() === RIGHT) {
        let extreme = 20;
        for (let i = 0; i < 20; i++) {
            if (player.getHead() === extreme) {
                return true;
            }
            extreme += 20;
        }
    }

    if (player.getDirection() === LEFT) {
        let extreme = 19;
        for (let i = 0; i < 20; i++) {
            if (player.getHead() === extreme) {
                return true;
            }
            extreme += 20;
        }
    }
}

function checkAppleEat() {
    if (fly === apple) {
        apple = randomPosition();
        return;
    }
    if (worm.getHead() === apple) {
        apple = randomPosition();
        worm.addPoint();
        return true;
    }
}

function checkAppleEatMP() {
    if (fly === apple) {
        apple = randomPosition();
        return;
    }
    if (worm.getHead() === apple) {
        apple = randomPosition();
        snake.body.shift();
        return;
    }
    if (snake.getHead() === apple) {
        worm.body.shift();
        apple = randomPosition();
        return;
    }
}

function game() {
    printScore();
    printTable();

    if (rules.fly) {
        fly = movePC(fly);
        printFly();
    }

    worm.move();
    checkAppleEat();
    checkLose(worm);

    printPlayer(worm);

    printApple();
}

function multiplayerGame() {
    printScore();
    printTable();

    worm.move();
    snake.move();

    if (rules.fly) {
        fly = movePC(fly);
        printFly();
    }

    checkAppleEatMP();
    checkLose(worm);
    checkLose(snake);

    printApple();
    printPlayer(worm);
    printPlayer(snake);
}

function movePC(pc) {
    if (apple < pc) {
        if (pc - apple > 15) {
            pc -= 20;
        } else {
            pc -= 1;
        }
    }
    if (apple > pc) {
        if (apple - fly > 15) {
            pc += 20;
        } else {
            pc += 1;
        }
    }
    return pc;
}

btnRight.addEventListener("click", changeDirection);
btnLeft.addEventListener("click", changeDirection);
btnUp.addEventListener("click", changeDirection);
btnDown.addEventListener("click", changeDirection);
btnRestart.addEventListener("click", restart);
menu.addEventListener("click", changeGameMode);
rulesMenu.addEventListener("click", changeRules);
playBtn.addEventListener("click", startGame);
//Keyboard handle
document.addEventListener("keydown", (e) => {
    e = e || window.event;
    changeDirection(e.key);
});
