class Enemy{
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.marekedForDeletion = false;
    }

    update(deltaTime){
        // movement
        this.x -= this.speedX + this.game.speed; //gamespeed es para que desaparezcan los enemigos la avanzar
        this.y += this.speedY;
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

        //check if it's off screen
        if (this.x + this.width < 0) {
            this.marekedForDeletion = true;
        }
    }

    draw(context){     
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);      

        //debug
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        //tamaño del sprite
        this.width = 60;
        this.height = 44;

        //posicion dentro del canvas
        this.x = this.game.width + Math.random() * this.game.width * 0.5; //inicia fuera del canvas
        this.y = Math.random() * this.game.height * 0.5; //inicial a azar en posicion y del canvas
        
        this.speedX = Math.random() * 1;
        this.speedY = 0;
        // los frames dentro del sprite sheet
        this.maxFrame = 5;

        this.image = document.getElementById("enemy_fly");
        //para que oscilen en el canvas
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }

    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById("enemy_plant");
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
    }

    //update y draw ya no son necesarios porque estan en la clase padre (Enemy)
}

export class ClimbingEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game;
        this.width = 120;
        this.height= 144;
        this.x = this.game.width;
        this.y = Math.random() *  this.game.height * 0.5;
        this.image = document.getElementById("enemy_spider_big");
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
    }

    update(deltaTime){
        super.update(deltaTime);
        //controla su existencia
        if (this.y > this.game.height - this.height - this.game.groundMargin){
            this.speedY *= -1;
        }

        if (this.y < -this.height) {
           this.marekedForDeletion = true; 
        }
    }

    draw(context){
        super.draw(context);
        // dibuja su linea (telaraña)
        context.beginPath();
        context.moveTo(this.x + this.width / 2, 0);
        context.lineTo(this.x + this.width / 2, this.y + 50);
        context.stroke();
    }
}
