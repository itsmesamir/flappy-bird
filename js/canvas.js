const canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 520;
const ctx = canvas.getContext('2d');
const beforeGame = document.getElementById('before-game');
const playBtn = document.getElementsByClassName('play');
const scoreDiv = document.getElementById('score');
const scoreCount = document.getElementById('score-count');

const afterGame = document.getElementById('after-game');
const beatHighScore = document.getElementById('beatHighScore');
const yourScore = document.getElementById('current-score');
const highScore = document.getElementById('high-score');

if (localStorage.getItem("flappyBird-high-score")) {
    highScore.innerHTML = localStorage.getItem("flappyBird-high-score");
}

const obstaclePositions = [400, 660, 890, 1110];
const gravity = 0.05;
const birdHeight = 50;
const birdWidth = 50;
let birdY = canvas.height / 2;
let birdX = 100;
const obstacles = [];
let backgroundSpeed = 2.2;
let score = 0;
let gameOver = false;
let downwardVelocity = 0;
let timer;

function setGravityTiming() {
    timer = setInterval(() => {
        downwardVelocity += gravity;
        birdY += downwardVelocity;
    }, 10)
}

function clearAllTimers() {
    let id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id);
    }
}

function clearGravity() {
    clearInterval(timer);
}

const createBird = function() {
    const bird = new Image();
    bird.src = './images/bird.png';
    bird.onload = function() {
        const animateBird = function() {
            ctx.drawImage(bird, birdX, birdY, birdWidth, birdHeight);
            if (gameOver) {
                return;
            };
            requestAnimationFrame(animateBird);
        }
        animateBird();
    }
}

function createBackground() {
    const background = [new Image(), new Image()];
    let width = canvas.width;
    for (let i = 0; i < background.length; i++) {
        background[i].left = i * width;
        background[i].src = './images/game-bg.png';
        background[i].onload = () => {
            const backgroundAnimate = () => {
                if (gameOver) return;
                background[i].left -= backgroundSpeed / 2;
                if (background[i].left <= -width) background[i].left = width;
                ctx.drawImage(background[i], background[i].left, 0, width, canvas.height);
                requestAnimationFrame(backgroundAnimate);
            }
            backgroundAnimate();
        }
    }
}

function setMovements() {
    function jump() {
        if (downwardVelocity > -0.3) {
            downwardVelocity = -1.8;
        } else if (downwardVelocity < -2.1) {
            downwardVelocity = downwardVelocity;
        } else {
            downwardVelocity -= 0.5;
        }
    }
    window.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            jump();
        };
    })
}

function drawObstacles() {
    for (let i = 0; i < obstaclePositions.length; i++) {
        obstacles[i] = new Obstacle(obstaclePositions[i]);
    }

    createBackground();
    createBird();
    for (let i = 0; i < obstaclePositions.length; i++) {
        obstacles[i].drawObstacle();

    }
    scoreDiv.style.display = 'block';
    scoreCount.innerHTML = '0';
}

function detectCollision() {
    if (birdY >= canvas.height || birdY <= 0) {
        return true;
    }
    for (let bar of obstacles) {
        if (birdY < bar.top + obstacleHeight || birdY + birdHeight - 2 > bar.topOfSecondBar) {
            if (birdX + birdWidth > bar.y && birdX < bar.y + obstacleWidth) {
                return true;
            }
        }
    }
}

function handleGameOver() {
    if (detectCollision()) {
        updateHighScore();
        gameOver = true;
        scoreDiv.style.display = 'none';
        canvas.style.display = 'none';
        afterGame.style.display = 'block';
        return;

    }
    requestAnimationFrame(handleGameOver);
}

function updateHighScore() {
    yourScore.innerHTML = score;
    if (score > highScore.innerHTML) {
        localStorage.setItem("flappyBird-high-score", score);
        highScore.innerHTML = score;
        beatHighScore.innerHTML = 'Congratulations, you have beaten the high score.';
    } else {
        beatHighScore.innerHTML = 'Oops, you could not beat the high score.';
    }
    score = 0;
}

function calculateScore() {
    function calculate() {
        for (let obs of obstacles) {
            if (!obs.scored && obs.y < birdX) {
                score++;
                console.log('the coere' + score);
                obs.scored = true;
                scoreCount.innerHTML = score;
            }
        }
        requestAnimationFrame(calculate);
    }
    calculate();
}

function startGame() {
    birdY = canvas.height / 2;
    backgroundSpeed = 2;
    score = 0;
    gameOver = false;
    downwardVelocity = 0;
    clearGravity();
    setGravityTiming();
    drawObstacles();
    calculateScore();
    handleGameOver();
    setMovements();
}

for (let btn of playBtn) {
    btn.addEventListener('click', function() {
        beforeGame.style.display = 'none';
        afterGame.style.display = 'none';
        canvas.style.display = 'block';
        startGame();
    });
}