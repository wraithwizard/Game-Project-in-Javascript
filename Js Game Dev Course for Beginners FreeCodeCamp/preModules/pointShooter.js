//3:19

const canvas2 = document.querySelector(".pointShoot");
const ctx = canvas2.getContext("2d");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

//collision canvas
const collisionCanvas = document.querySelector(".collisionCanvas");
const ctxCol = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;


let ravens = [];
let timeToNextRaven = 0;
//miliseconds en aparicion de un nuevo raven
let ravenInterval = 500;
let lastTime = 0;

let score = 0;
ctx.font = "50px Impact";
let gameOver = false;

let particles = [];

class Raven{
    constructor(){
        // la imagen
        this.image = new Image();
        this.image.src = "raven.png";

        this.spriteWidth = 271;
        this.spriteHeight = 194;        
        //randomiza el tamaño
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        //posicion
        this.x = canvas2.width;
        this.y = Math.random() * (canvas2.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        //borra los ravens fuera de la pantalla
        this.markedForDeletion = false;

        this.frame = 0;
        this.maxFrame = 4;
        //para normalizar la animacion en cualquier PC
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;    
        
        //colorea un cuervo al azar
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        //particles
        this.hasTrail = Math.random() > 0.5;
    }

    update(deltatime){
        //si tocan el fondo del canvas o el top, regresar al canvas
        if (this.y < 0 || this.y > canvas2.height - this.height) {
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }

        // normaliza la animacion en cualquier pc
        this.timeSinceFlap += deltatime;
        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame) {
                this.frame = 0;
            }else{
                this.frame++;
                this.timeSinceFlap = 0;
                //agrega particulas
                if (this.hasTrail) {
                    for (let index = 0; index < 5; index++) {
                        particles.push(new Particle(this.x, this.y, this.width, this.color));                        
                    }                  
                }              
            }       
        }

        //si un cuervo rebasa la pantalla
        if (this.x < 0 - this.width) {
            gameOver = true;
        }
    }

    draw(){
        //colorea el cuadrado del raven
        ctxCol.fillStyle = this.color;
        ctxCol.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

function drawScore(){
    //el sombreado del texto
    ctx.fillStyle = "black";
    //los num. son coordenadas
    ctx.fillText("Score " +score, 50, 75);
    ctx.fillStyle = "white";
    ctx.fillText("Score " +score, 55, 80);
}

// explosiones
let explosions = [];
class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = "explosiones/boom.png";
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = "explosiones/explosion.wav";
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }

    update(deltatime){
        //produce el sonido una vez por animacion
        if (this.frame === 0) {
            this.sound.play();
        }

        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) {
                this.markedForDeletion = true;
            }
        }
    }
    
    draw(){
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size);
    }
}

window.addEventListener("click", function(e){
    const detectPixelColor = ctxCol.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor)
    //recoge el dato del color
    const pc = detectPixelColor.data;
    //detecta la colision
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
            object.markedForDeletion = true;
            //anota en el marcador
            score++;
            //explota ysuena
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    });
});

function drawGameOver(){
    //centra el texto
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER, tu score es: " +score, canvas2.width / 2, canvas2.height / 2);
    // sombreado
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER, tu score es: " +score, canvas2.width /2, canvas2.height / 2 + 5);

}

class Particle{
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + this.size / 2 + Math.random() * 50 - 25;
        this.y = y + this.size / 3 + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size / 20;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() *5 + 10;
        this.color = color;
    }

    update(){
        this.x += this.speedX;
        this.radius += 0.1;
        //hace que no parpadee la particula
        if (this.radius < this.maxRadiu - 5) {
            this.markedForDeletion = true;
        }
    }

    draw(){
        ctx.save();
        //achica la particula
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *100);
        ctx.fill();
        ctx.restore();
    }
}

function animate(timestamp){
    ctx.clearRect(0, 0, canvas2.width, canvas2.height);
    ctxCol.clearRect(0, 0, canvas2.width, canvas2.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        //hace que los cuervos chicos se vean atras de los grandes
        ravens.sort(function(a, b){
            return a.width - b.width;
        });
    }
    // el score esta detras del layer del raven
    drawScore();

    // agrega cuervos, explosiones y particulas
    // el orden altera el layer
    [...ravens, ...explosions, ].forEach(object => object.update(deltatime));
    [...ravens, ...explosions, ].forEach(object => object.draw());
    
    ravens = ravens.filter(object => !object.markedForDeletion);  
    explosions = explosions.filter(object => !object.markedForDeletion);  
    particles = particles.filter(object => !object.markedForDeletion);  

    // if (!gameOver){
        requestAnimationFrame(animate); 
    // }else{
    //     drawGameOver();
    // }
}
animate(0);