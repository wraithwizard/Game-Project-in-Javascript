// 5:48
//sirve tambien para probar arte de Asenat

// para que cargue todos los assets al mismo tiempo
document.addEventListener("DOMContentLoaded", function(){ //anonymus function
    const canvas = document.querySelector(".canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1200;
    canvas.height = 720;

    let enemies = [];
    let score = 0;
    let gameOver = false;

    const fullScreenButton = document.getElementById("fullScreenButton");

    class InputHandler{
        constructor(){
            this.keys = [];
            //touch variables
            this.touchY = "";
            this.touchTreshold = 30;

            window.addEventListener("keydown", e => {
                if ((e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight") && this.keys.indexOf(e.key) === -1) { 
                    this.keys.push(e.key);
                    // console.log("presionaste la: " +this.keys)
                }else if(e.key === "Enter" && gameOver){
                    restartGame();
                }
            });

            window.addEventListener("keyup", e => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    // console.log("Se borro la: " + e.key)
                }
            });

            //touch controls
            window.addEventListener("touchstart", e =>{
                this.touchY = e.changedTouches[0].pageY;
            });
            window.addEventListener("touchmove", e =>{
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < -this.touchTreshold && this.keys.indexOf("swipe up") === -1) {
                    this.keys.push("swipe up");
                } else if(swipeDistance > this.touchTreshold && this.keys.indexOf("swipe down" === -1)){
                    this.keys.push("swipe down");
                    if(gameOver){
                        restartGame();
                    }
                }
            });
            window.addEventListener("touchend", e =>{
                this.keys.splice(this.keys.indexOf("swipe up"), 1);
                this.keys.splice(this.keys.indexOf("swipe down"), 1);
            });
        }
    }

    class Player{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 165;
            this.height = 165; 
            //posicion en el canvas
            this.x = 0; 
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById("playerImage");
            //para que identifique la zona del sprite sheet
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 6;
            //que tan rapido se pasea por los sprites sheet horizontalmente
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            //para el control
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }

        draw(context){      
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }

        update(input, deltaTime, enemies, context){
            // collisions
            enemies.forEach(enemy =>{
                const dx = (enemy.x  + enemy.width/2) - (this.x + this.width/6);
                const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2 + 20);
                const distance = Math.sqrt(dx * dx + dy *dy);
                if (distance < enemy.width /2 + this.width /2) {
                    gameOver = true;
                }
            })

            //animacion, si parpadea... es porque se pasa de las animaciones del sprite sheet
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 0;
                } else {
                    this.frameX++;
                    this.frameTimer = 0;
                }
            } else {
                this.frameTimer += deltaTime;
            }

            //control
            if (input.keys.indexOf("ArrowRight") > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf("ArrowLeft") > -1){
                this.speed = -5;       
                // this.maxFrame = - 4;       
            }else if((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("swipe up") >-1) && this.onGround()){
                this.vy -= 32;
            }else{
                this.speed = 0;
            }

            // horizontal movement
            this.x += this.speed;
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x > this.gameWidth - this.width){
                this.x = this.gameWidth - this.width;
            }

            // vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                //cambia la animacion del sprite
                this.maxFrame = 6;
                this.frameX = 3;
            }else{
                this.vy =0;
                //cambia la animacion del sprite
                this.maxFrame = 6;
                this.frameY = 0;
            }

            if (this.y > this.gameHeight - this.height) {
                this.y = this.gameHeight - this.height;
            }
        }

        // detecta si esta en piso
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }

        restart(){
            //regresa al valor original
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 6;
            this.frameY = 0;
        }
    }

    class Background{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById("backgroundImage");
            this.x =0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }

        draw(ctx){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            //ajusta que no haya gaps en el fondo
            ctx.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }

        update(){
            // scroll to the left
            this.x -= this.speed;
            // si el fondo se sale de pantalla, resetear
            if(this.x < 0 -this.width) this.x =0;
        }

        restart(){
            this.x =0;
        }
    }

    class Enemy{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;   
            this.gameHeight = gameHeight;
            this.width = 270;
            this.height = 194;
            this.image = document.getElementById("enemyImage");
            this.x = this.gameWidth;
            this.y= this.gameHeight - this.height;        
            this.frameX = 0;
            this.maxFrame = 5;
            //que tan rapido se pasea por los sprites sheet horizontalmente
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;

            this.speed = 8;
            this.maredForDeletion = false;
        }

        draw(context){       
            //hitbox
            context.lineWidth = 5;
            context.strokeStyle ="white";
            // context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width / 2 - 20, this.y + this.height /2, this.width /3, 0, Math.PI * 2);
            // context.strokeRect(this.x, this.y, this.width, this.height);
            // context.stroke();

            // context.strokeStyle ="blue";
            // context.beginPath();
            // context.arc(this.x, this.y, this.width /2, 0, Math.PI * 2);
            // context.stroke();            
            
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    
        update(deltaTime){
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 0;
                } else {
                    this.frameX++;
                    this.frameTimer = 0;
                }
            }else{
                this.frameTimer += deltaTime;
            }            
            this.x -= this.speed;

            //desaparecer si pasa el canvas
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }    
    }

    function handleEnemies(deltaTime, context){
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            enemyTimer = 0; 
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });

        //borra el enemigo
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function displayStatusText(context){
        context.textAlign = "left";
        context.font = "40px Helvetica";
        context.fillStyle = "black";
        context.fillText("Score " +score, 20, 50 );
        context.fillStyle = "white";
        context.fillText("Score " +score, 22, 52 );

        // gameover
        if (gameOver) {
            context.textAlign = "center";
            context.fillStyle = "black";
            context.fillText("GAME OVER! press Enter or swipe down to restart", canvas.width /2, 200 );
            context.fillStyle = "white";
            context.fillText("GAME OVER, press Enter or swipe down to restart", canvas.width /2 + 2, 202);
        }
    }  

    // reinicia todo
    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score =0;
        gameOver = false;
        animate(0);
    }

    function toggleFullscreen(){
        if(!document.fullscreenElement){
            canvas.requestFullscreen().catch(err =>{
                alert(`Error, cant enable fullscreen mode: ${err.message}`);
            });
        }else{
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener("click", toggleFullscreen);

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 +500;

    // corre 60 times * sec
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0,0, canvas.width, canvas.height);
    
        // el fondo debe ir antes para que sea visibile
        background.draw(ctx);
        background.update();

        player.draw(ctx);
        player.update(input, deltaTime, enemies, ctx);

        handleEnemies(deltaTime, ctx);
        displayStatusText(ctx);
        
        if(!gameOver){
            requestAnimationFrame(animate);
        }
    }
    animate(0);       
});