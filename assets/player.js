import { Falling, Jumping, Running, Sitting, Rolling } from "./playerStates.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.verticalSpeed = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeedInPixelsPerFrame = 10;

        this.states = [new Sitting(this.game),
        new Running(this.game),
        new Jumping(this.game),
        new Falling(this.game),
        new Rolling(this.game)];
    }

    update(input, deltaTime) {
        this.checkCollissions();
        this.currentState.handleInput(input);
        this.x += this.speed;
        if (input.includes('ArrowRight'))
            this.speed = this.maxSpeedInPixelsPerFrame;
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeedInPixelsPerFrame;
        else this.speed = 0;

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        //vertical
        this.y += this.verticalSpeed;
        if (!this.onGround()) this.verticalSpeed += this.weight;
        else this.verticalSpeed = 0;
        //sprite animation

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        }
        else {
            this.frameTimer += deltaTime;
        }


    }

    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(this.image,
            this.frameX * this.width, this.frameY * this.height,
            this.width, this.height,
            this.x, this.y, this.width, this.height);
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed) {
        this.currentState = this.states[state]
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollissions() {
        this.game.enemies.forEach(enemy => {
            if (enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y) {
                enemy.markedForDeletion = true;
                this.game.score++;
            }
            else {

            }
        })
    }
}
