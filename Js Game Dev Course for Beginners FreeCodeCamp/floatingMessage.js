export class FloatingMessage{
    constructor(value, x, y, targetX, targetY){
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.markedForDeletion = false;
        this.timer = 0;
    }

    update(){
        //se multiplica por 0.03 para que se mueva despacio
        this.x += (this.targetX - this.x) * 0.03;
        this.y += (this.targetY - this.y) * 0.03;
        this.timer++;
        //desaparecer tras cierto tiempo
        if (this.timer > 100) {
            this,this.markedForDeletion = true;
        }
    }

    draw(context){
        context.font =  "20px Creespter";
        context.fillStyle = "white";
        context.fillText(this.value, this.x, this.y);
        context.fillStyle = "black";
        context.fillText(this.value, this.x - 2, this.y - 2);
    }
}