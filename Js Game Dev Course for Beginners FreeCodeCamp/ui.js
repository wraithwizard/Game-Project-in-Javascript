export class UI{
    constructor(game){
        this.game= game;
        this.fontSize = 30;
        this.fontFamily = "Creepster";
        this.livesImg = document.getElementById("lives");
    }

    draw(context){    
        //para el sombreado del texto,
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "white";
        context.shadowBlur = 0;

        context.font = this.fontSize + "px " + this.fontFamily;
        context.textAlign = "left";
        context.fillStyle = this.game.fontColor;
        //score
        context.fillText("Score " + this.game.score, 20, 50);
        //timer
        context.font = this.fontSize * 0.8 + "px " + this.fontFamily;        
        //arregla el tiempo a 0.0
        context.fillText("Tiempo " + (this.game.time * 0.001).toFixed(1), 20, 80);
        // game over
        if (this.game.gameOver) {
            context.textAlign = "center";
            context.font = this.fontSize * 2 + "px " + this.fontFamily;
            if (this.game.score > 20) {
                context.fillText("WAHOO!!", this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
                context.fillText("¿A qué le temen las criaturas de la noche? ¡¡A ti!!", this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.fillText("¡¿Está tiste?!", this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
                context.fillText("¡¡BUAJAJAJA perdiste BUAJAJAJA!!", this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }

        //lives
        for (let index = 0; index < this.game.lives; index++) {
            context.drawImage(this.livesImg, 25 * index+25, 95, 25 , 25);
        }

        //para que solo el texto se sombree y no todos los elementos
        context.restore();
    }
}