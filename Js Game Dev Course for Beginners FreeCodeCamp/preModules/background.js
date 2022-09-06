// cambiar el nombre de la variable para que no se confunda con el script.js
const canvas2= document.querySelector(".backgroundCanvas");
const ctx2 = canvas2.getContext("2d");
const CANVAS_WIDTH2 = canvas2.width = 800;
const CANVAS_HEIGHT2 = canvas2.height = 700;
let gameSpeed = 10;
//let gameFrame2 = 0;

// layers
const backgroundLayer1 = new Image();
backgroundLayer1.src = "background/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "background/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "background/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "background/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "background/layer-5.png";

// slider
const slider = document.querySelector(".slider");
slider.value = gameSpeed;
const showGameSpeed = document.querySelector(".showGameSpeed");
showGameSpeed.innerHTML = gameSpeed;
slider.addEventListener("change", function(e){
    gameSpeed = e.target.value;
    // actualiza el numero mostrado
    showGameSpeed.innerHTML = e.target.value;
});

class Layer{
    constructor(image, speedModifier){
        // posiciones de las imagenes
        this.x = 0;
        this.y = 0;
         // la imagen mide 2400px largo
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }

    // animacion del background
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0;
        }

        if (this.x2 <= -this.width) {
            this.x2 = this.width + this.x - this.speed;
        }

        this.x = Math.floor(this.x - this.speed);
        // this.x2 = Math.floor(this.x2 - this.speed);
        // this.x = gameFrame2 * this.speed % this.width;
    }
    
    draw(){
        ctx2.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx2.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1);

// para no repetir codigo con cada objeto layer
const gameObjects = [layer1, layer2, layer3, layer4, layer5];

function animate(){
    ctx2.clearRect(0, 0, CANVAS_WIDTH2, CANVAS_HEIGHT2);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });
    //gameFrame2--;
   
    requestAnimationFrame(animate);
}
animate;