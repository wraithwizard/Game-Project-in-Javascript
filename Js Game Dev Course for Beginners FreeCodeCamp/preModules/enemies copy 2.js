/** @type {HTMLCanvasElement} */ //hace que el IDE detecte las funciones del canvas
const canvas= document.querySelector(".canvasEnemies");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;

const numbersOfenemies = 200;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
    constructor(){
        //sprites
        this.image = new Image();
        this.image.src = "enemies/enemy2.png";
     
        this.speed = Math.random() * 4 + 1;
        
        // dimensiones
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        //posicion random
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        //aleteo random
        this.flapSpeed = Math.floor(Math.random() * 3 +1);
        //sine angle
        this.angle = Math.random() * 2;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 7;
    }
    
    //movimiento
    update(){
        this.y += this.curve * Math.sin(this.angle);
        this.x -= this.speed;
        this.angle += this.angleSpeed;
        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }
        //animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }

    //dibujo
    draw(){
        //carga el sprite
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

// creacion de objetos enemy
for (let index = 0; index < numbersOfenemies; index++) {
    enemiesArray.push(new Enemy()); 
}

function animate(){
    //limpia la pantalla
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //mueve los enemigos
    enemiesArray.forEach(enemy =>{
        enemy.update();
        enemy.draw();
    })  

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();