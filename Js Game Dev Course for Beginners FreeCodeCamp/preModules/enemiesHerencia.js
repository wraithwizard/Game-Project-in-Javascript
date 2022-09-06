// 4:47

// para que cargue-
document.addEventListener("DOMContentLoaded", function(){
    const canvas2 = document.getElementById("canvasHerencia");
    const ctx = canvas2.getContext("2d");
    canvas2.width = 500;
    canvas2.height = 800;
    
    class Game{
        constructor(ctx, width, height){
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = ["worm", "ghost", "spider"];
        }
    
        update(deltaTime){
            this.enemies = this.enemies.filter(object => !object.markedForDeletion);

            if (this.enemyTimer > this.enemyInterval) {
                this.#addNewEnemy();
                //reset
                this.enemyTimer = 0;
                // console.log(this.enemies);
            } else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(object => object.update(deltaTime));            
        }
    
        draw(){
            this.enemies.forEach(object => object.draw(this.ctx));    
        }
    
        // sintaxis para metodo private
        #addNewEnemy(){
            //tipos de enemigos
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];

            if (randomEnemy == "worm"){
                this.enemies.push(new Worm(this));
            }else if(randomEnemy == "ghost"){
                this.enemies.push(new Ghost(this));
            }else if(randomEnemy == "spider") {
                this.enemies.push(new Spider(this));
            }
            //hace que los cuervos de arriba se muestran detras de los de abajo
            // this.enemies.sort(function(a, b){
            //     return a.y - b.y;
            // });
        }
    }
    
    class Enemy{
        constructor(game){
            this.game = game;   
            this.markedForDeletion = false;         
            //para animar
            this.frameX;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }
    
        update(deltaTime){
            this.x -= this.vx * deltaTime;
            // remove enemies
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
            }

            //animation
            if (this.frameTimer < this.frameInterval) {
                if (this.frameX > this.maxFrame) {
                    this.frameX++;
                } else {
                    this.frameX = 0;
                    this.frameTimer = 0;
                }
            } else {
                this.frameInterval += deltaTime;
            }
        }
    
        draw(ctx){         
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class Worm extends Enemy{
        constructor(game){
            //accede al constructor padre
            super(game);
            //medidas de la imagen en el sprite sheet
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;
            this.x = this.game.width;
            this.y = this.game.height - this.height;            
            this.image = worm;
            this.vx = Math.random() * 0.1 + 0.1;
        }
    }

    class Ghost extends Enemy{
        constructor(game){
            //accede al constructor padre
            super(game);
            //medidas de la imagen en el sprite sheet
            this.spriteWidth = 261;
            this.spriteHeight = 209;
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;
            //position
            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.6;            
            this.image = ghost;
            this.vx = Math.random() * 0.2 + 0.1;
            //el angulo del seno
            this.angle= 0;
            // el angulo del coseno
            this.curve = Math.random() * 3;
        }

        update(deltaTime){
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.04;
        }

        draw(ctx){
            // opacity, el save es para que solo afecte a la clase Ghost
            ctx.save();
            ctx.globalAlpha = 0.7;
            super.draw(ctx);
            ctx.restore();
        }
    }

    class Spider extends Enemy{
        constructor(game){
            //accede al constructor padre
            super(game);
            //medidas de la imagen en el sprite sheet
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;
            this.x = Math.random() * this.game.width;
            this.y = 0 - this.height;            
            this.image = spider;
            this.vx = 0;
            //aparece de arriba hacia abajo
            this.vy = Math.random() * 0.1 +0.1;
            this.maxLength = Math.random() * game.height;
        }

        update(deltaTime){
            super.update(deltaTime);
            //desaparecer si llegan arriba del canvas
            if (this.y < 0 -this.height * 2) {
                this.markedForDeletion = true;
            }
            
            //vertical speed
            this.y += this.vy * deltaTime;
            if (this.y > this.maxLength) {
                this.vy *= -1;
            }
        }

        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.x + this.width /2, 0);
            ctx.lineTo(this.x + this.width / 2, this.y + 10);
            ctx.stroke();
            super.draw(ctx);        
        }
    }

    const game = new Game(ctx, canvas2.width, canvas2.height);
    let lastTime = 1;
    function animate(timeStamp){
        ctx.clearRect(0,0, canvas2.width, canvas2.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);
        game.draw();
        requestAnimationFrame(animate);
    }
    animate(0);   
});