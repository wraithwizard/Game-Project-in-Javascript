import {Sitting, Running, Jumping, Falling, Rolling, Diving, Hit} from "./playerStates.js";
import {CollisionAnimation} from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessage.js";

//no es obligatorio poner el default
export class Player{
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;    
        //posicion en canvas
        this.x = 0;
        //manda el sprite hasta abajo del canvas
        this.y = this.game.height - this.height - this.game.groundMargin;

        //el dibujo en el sprite sheet
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20; //el recomendado para este spritesheet
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;

        //vertical variables
        this.vy = 0;
        this.weight = 1;

        this.image = document.getElementById("player");    
        
        //controls
        this.speed = 0;
        this.maxSpeed = 10;     
        
        //states
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        //clean up
        this.currentState = null;  
    }

    update(input, deltaTime){
        //horizontal movement
        this.x += this.speed;
        //paralizar ocurre colision
        if (input.includes("ArrowRight") && this.currentState !== this.states[6]){
            this.speed = this.maxSpeed;
        } else if(input.includes("ArrowLeft") && this.currentState !== this.states[6]){
            this.speed = -this.maxSpeed;
        }else{
            this.speed = 0;
        }

        //horizontal boundaries
        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width;
        }

        //vertical movement    
        this.y += this.vy;

        if (!this.onGround()) {
            this.vy += this.weight;
        } else {
            this.vy = 0;
        }

        //vertical boundaries
        if (this.y > this.game.height - this.height -this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }


        this.currentState.handleInput(input);

        //animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        } else {
            this.frameTimer += deltaTime;
        }

        //collisions
        this.checkCollision();
     }

    draw(context){     
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

        //debug
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }  

    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    //speed es para controlar los fondos
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (enemy.x < this.x + this.width && enemy.x + enemy.width > this.x && enemy.y < this.y + this.height && enemy.y + enemy.height > this.y) {
                //collision
                enemy.markedForDeletion = true;
                //centra las colisiones de los enemigos
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));

                //si hace rolling o diving... score
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                    //floating text
                    this.game.floatingMessages.push(new FloatingMessage("+1", enemy.x, enemy.y, 150, 100));
                } else {
                    // de lo contrario, HIT
                    this.setState(6, 0);
                    //reduccion de vidas
                    this.game.lives--;
                    if (this.game.lives <= 0) {
                        this.game.gameOver = true;
                    }
                }
            } 
        });
    }
}