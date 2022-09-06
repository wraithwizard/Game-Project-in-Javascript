const canvasCol= document.querySelector(".collisions");
const ctx = canvasCol.getContext("2d");
canvasCol.width = 500;
canvasCol.height = 700;

const explosions = [];

//para que detecte correctament el mouse click
let canvasPosition = canvasCol.getBoundingClientRect();

class Explosions{
    constructor (x, y){      
        //medida del sprite
        this.spriteWidth = 200; 
        this.spriteHeight = 179;
        this.width = this.spriteWidth * 0.7;
        this.height = this.spriteHeight * 0.7;
        // centrar la imagen en el cursor
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        // la imagen
        this.image = new Image();
        this.image.src = "explosiones/boom.png";
        this.frame = 0;
        //para que se muestre toda la animacion de la explosion
        this.timer = 0;
        //sonido!
        this.sound = new Audio();
        this.sound.src = "explosiones/explosion.wav"
    }

    update(){
        //produce el sonido una vez por animacion
        if (this.frame === 0) {
            this.sound.play();
        }
        this.timer++;
        //control la velocidad de la animacion
        if (this.timer % 10 === 0) {
            this.frame++;
        }
    }
    
    draw(){
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

window.addEventListener("click", function(e){
    createAnimation(e);
    // ctx.fillStyle = "white";
    //crea un rectangulo al hacer click de tamaño 50x50
    // ctx.fillRect(e.x - canvasPosition.left - 25, e.y - canvasPosition.top - 25, 50, 50);
})

//explosion
function createAnimation(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosions(positionX, positionY));
}

function animate(){
    ctx.clearRect(0, 0, canvasCol.width, canvasCol.height);
    for (let index = 0; index < explosions.length; index++) {
        explosions[index].update();
        explosions[index].draw();
        if (explosions[index].frame > 5) {
            explosions.splice(index, 1);
            index--;
        }
    }
    requestAnimationFrame(animate);
}
animate();