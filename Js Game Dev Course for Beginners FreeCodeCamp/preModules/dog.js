// https://www.youtube.com/watch?v=GFO_txvwK_c 
// 2:50 h

let playerState = "idle";
// el boton para ver las animaciones
const dropwdown = document.getElementById("animations");
// dropwdown.addEventListener("change", function(e){
//     playerState = e.target.value;
// })


const canvas= document.querySelector(".canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

// bring the image
const playerImage = new Image();
playerImage.src = "shadow_dog.png";

// el spredshit del perrito mide 6876px que se deben dividir entre las 12 columnas (dibujos) lo que da un resultado de 575px
const spriteWidth = 575;
// si dividimos la altura del spritesheet entre 10 filas nos da 523px
const spriteHeight = 523;
// ubica los sprites desde el spriteSheet horizontalmente
// let frameX = 0;
// ubica los sprites desde el spriteSheet verticalmente
// let frameY = 0;
// para normalizar la velocidad de las animaciones
let gameFrame = 0;
const staggerFrames = 5;

// arrays para congifurar la animaciones desde el spriteSheet
const spriteAnimations = [];
const animationStates = [
    {
        name: "idle",
        frames: 7,
    },
    {
        name: "jump",
        frames: 7
    },
    {
        name: "fall",
        frames: 7,
    },
    {
        name: "run",
        frames: 9,
    },
    {
        name: "dizzy",
        frames: 11,
    },
    {
        name: "sit",
        frames: 5,
    },
    {
        name: "roll",
        frames: 7,
    },
    {
        name: "bite",
        frames: 7,
    },
    {
        name: "ko",
        frames: 12,
    },
    {
        name: "getHit",
        frames: 4,
    },
];

animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for (let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames;
});

// animemos el perrito
function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Math floor se deshace de los decimales, esto es para indicar la posicion en el sprite sheet
    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    // queremos dibujar la imagen de un sprite sheet dentro del canvas
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);    
    gameFrame ++;
    requestAnimationFrame(animate);
}
animate();


