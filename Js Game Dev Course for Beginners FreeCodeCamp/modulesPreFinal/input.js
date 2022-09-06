export default class InputHandler{
    constructor(){
        this.lastKey = "";
        window.addEventListener("keydown", (e) =>{
            switch(e.key){
                case "ArrowLeft": this.lastKey = "Press Left";
                break;
                case "ArrowRight": this.lastKey = "Press Right";
                break;
                case "ArrowDown": this.lastKey = "Press Down";
                break;
                case "ArrowUp": this.lastKey = "Press Up";
                break;
            }
        });

        window.addEventListener("keyup", (e) =>{
            switch(e.key){
                case "ArrowLeft": this.lastKey = "Release left";
                break;
                case "ArrowRight": this.lastKey = "Release right";
                break;
                case "ArrowDown": this.lastKey = "Release down";
                break;
                case "ArrowUp": this.lastKey = "Release up";
                break;
            }
        });
    }
}