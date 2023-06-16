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
const restartMenu = document.getElementById("restart-menu");
//Buttons
const btnRestart = document.getElementById("btn-restart");
const radioButtons = document.getElementsByName("radio");
const checkButtons = document.getElementsByName("checkbox");
const mainMenuBtn = document.getElementById("main-menu-btn");
//Player buttons
const btnRight = document.getElementById("btn-right");
const btnLeft = document.getElementById("btn-left");
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
//Audio
const eat = new Audio("sounds/eat.wav");

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
        snake.changeBody([400]);
    }
    setTimeout(() => {
        score.classList.remove(HIDDEN);
        restartMenu.classList.remove(HIDDEN);
        container.classList.remove(HIDDEN);
        title.classList.add(HIDDEN);
        playBtn.classList.add(HIDDEN);
        gameMenu.classList.add(HIDDEN);
        rulesMenu.classList.add(HIDDEN);
        runningGame = setInterval(`${mode}()`, interval);
    }, 2000);
}

function mainMenu() {
    clearInterval(runningGame);
    restartMenu.classList.add(HIDDEN);
    container.classList.add(HIDDEN);
    title.classList.remove(HIDDEN);
    score.classList.add(HIDDEN);
    playBtn.classList.remove(HIDDEN);
    gameMenu.classList.remove(HIDDEN);
    rulesMenu.classList.remove(HIDDEN);
    startIMG.classList.remove(HIDDEN);
    endIMG.classList.add(HIDDEN);
    endIMG.classList.remove("animation");
    worm.changeBody([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    worm.resetPoints();
    worm.changeDirection(RIGHT);
    snake.changeBody([399, 398, 397, 396, 395, 394, 393, 392, 391, 390]);
    snake.changeDirection(LEFT);
    snake.resetPoints();
    printTable();
    apple = randomPosition();
}

function restart() {
    clearInterval(runningGame);
    if (mode === "game") {
        worm.resetPoints();
        worm.changeBody([0, 1, 2]);
        worm.changeDirection(RIGHT);
        snake.changeBody([400]);
        fly = 399;
        apple = randomPosition();
    } else {
        worm.changeBody([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        worm.resetPoints();
        worm.changeDirection(RIGHT);
        snake.changeBody([399, 398, 397, 396, 395, 394, 393, 392, 391, 390]);
        snake.changeDirection(LEFT);
        snake.resetPoints();
        apple = randomPosition();
    }
    runningGame = setInterval(`${mode}()`, interval);
}

const player = (name, body, direction) => {
    let points = 0;

    const changeBody = (newBody) => body.splice(0, body.length, ...newBody);
    const addPoint = () => points++;
    const getPoints = () => points;
    const resetPoints = () => (points = 0);
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
        resetPoints,
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
    return Math.floor(Math.random() * 400);
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
    if (player.getLength() < 1) {
        lose(player);
    }
    if (checkCollisionBorders(player)) {
        lose(player);
    }
    if (checkCollision(player)) {
        lose(player);
    }
    if (checkCollisionSelf(player)) {
        lose(player);
    }
}

function lose(player) {
    player.changeBody([]);
    clearInterval(runningGame);
}

function checkCollision(player) {
    if (!rules.collision) {
        return;
    }
    if (player.getName() === WORM) {
        return snake.body.some((body) => body === worm.getHead());
    } else {
        return worm.body.some((body) => body === snake.getHead());
    }
}

function checkCollisionSelf(player) {
    if (!rules.collisionSelf) {
        return;
    }
    for (let i = 0; i <= player.getLength() - 2; i++) {
        if (player.body[i] === player.getHead()) {
            return true;
        }
    }
}

function checkCollisionBorders(player) {
    if (!rules.collisionBorders) {
        return;
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
        eat.load();
        eat.play();
        apple = randomPosition();
        return;
    }
    if (worm.getHead() === apple) {
        eat.load();
        eat.play();
        apple = randomPosition();
        worm.addPoint();
        return true;
    }
}

function checkAppleEatMP() {
    if (fly === apple) {
        apple = randomPosition();
        eat.load();
        eat.play();
        return;
    }
    if (worm.getHead() === apple) {
        apple = randomPosition();
        snake.body.shift();
        eat.load();
        eat.play();
        return;
    }
    if (snake.getHead() === apple) {
        worm.body.shift();
        apple = randomPosition();
        eat.load();
        eat.play();
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
mainMenuBtn.addEventListener("click", mainMenu);
//Keyboard handle
document.addEventListener("keydown", (e) => {
    e = e || window.event;
    changeDirection(e.key);
    if (e.key === "r") {
        restart();
    }
    if (e.key === "Escape") {
        mainMenu();
    }
});
