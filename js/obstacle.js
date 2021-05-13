const minimumGap = 150;
const maximumGap = 200;
const obstacleHeight = 350;
const obstacleWidth = 50;

class Obstacle {
    constructor(y) {
        this.y = y;
        this.gap = generateRandom(minimumGap, maximumGap);
        this.top = generateRandom(-325, -20);
        this.topOfSecondBar = this.top + obstacleHeight + this.gap;
        this.scored = false;
    }
    drawObstacle() {
        let obstacleTop = new Image();
        let obstacleDown = new Image();
        obstacleTop.src = './images/bar-top.png';
        obstacleDown.src = './images/bar-bottom.png';
        obstacleTop.onload = () => {
            const obstacleAnimation = () => {
                if (gameOver) {
                    return;
                }
                ctx.drawImage(obstacleTop, this.y, this.top, obstacleWidth, obstacleHeight);
                this.y -= 1.5 * backgroundSpeed;
                if (this.y < -50) {
                    this.top = generateRandom(-295, -20);
                    this.gap = generateRandom(minimumGap, maximumGap);
                    this.topOfSecondBar = this.top + obstacleHeight + this.gap;
                    this.y = canvas.width + 150;
                    this.scored = false;
                }
                requestAnimationFrame(obstacleAnimation);
            }
            obstacleAnimation();
        }
        obstacleDown.onload = () => {
            const obsAnimation = () => {
                if (gameOver) return;
                ctx.drawImage(obstacleDown, this.y, this.topOfSecondBar, obstacleWidth, obstacleHeight);
                requestAnimationFrame(obsAnimation);
            }
            obsAnimation();
        }
    }
}