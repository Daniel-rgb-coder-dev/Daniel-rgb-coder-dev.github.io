const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

const pipes = [];
const pipeWidth = 20;
const pipeGap = 100;
let frameCount = 0;
let gameOver = false;

document.addEventListener('keydown', () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        resetGame();
    }
});

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frameCount = 0;
    gameOver = false;
}

function drawBird() {
    context.fillStyle = '#FF0';
    context.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    context.fillStyle = '#0F0';
    for (const pipe of pipes) {
        context.fillRect(pipe.x, pipe.y, pipeWidth, pipe.height);
        context.fillRect(pipe.x, pipe.y + pipe.height + pipeGap, pipeWidth, canvas.height - pipe.height - pipeGap);
    }
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
        pipes.push({ x: canvas.width, y: 0, height: pipeHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }

        if (
            bird.x < pipes[i].x + pipeWidth &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].height || bird.y + bird.height > pipes[i].height + pipeGap)
        ) {
            gameOver = true;
        }
    }
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        drawBird();
        drawPipes();
        updateBird();
        updatePipes();
        frameCount++;
    } else {
        context.fillStyle = '#000';
        context.font = '24px Arial';
        context.fillText('Game Over', canvas.width / 4, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
