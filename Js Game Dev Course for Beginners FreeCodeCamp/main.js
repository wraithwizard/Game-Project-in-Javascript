import {Player} from "./player.js"; //asi se importa sin la palabra default
import {InputHandler} from "./input.js";
import {Background} from "./background.js";
import {FlyingEnemy, ClimbingEnemy, GroundEnemy} from "./enemies.js";
import {UI} from "./ui.js";
// //como solo es funcion se importa asi...
// import {drawStatusText} from "./utils.js";

window.addEventListener("load", function(){
    //para que intellisense detecte canvas
   
    const canvas = document.querySelector(".canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 900;
    canvas.height = 500;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            // nivel de piso
            this.groundMargin = 80;
            //velocidad del background
            this.speed = 0;
            this.maxSpeed = 4;
            //objects
            this.player = new Player(this);     
            this.input = new InputHandler(this);   
            this.background = new Background(this);   
            this.UI = new UI(this);

            //para los enemigos
            this.enemies = [];
            this.enemyTimer = 0;
            //1000 = 1 segundo
            this.enemyInterval = 1000;
            //debug
            this.debug = false;
            //score
            this.score = 0;
            this.fontColor = "black";

            //se movieron aqui estas variables para el refactor con particles
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();

            //particles
            this.particles = [];
            this.maxParticles = 50;

            //collisions
            this.collisions = [];

            this.time = 0;
            //duration of game
            this.maxTime = 20000;
            this.gameOver = false;

            //lives 
            this.lives = 2;
            //floating text
            this.floatingMessages = [];
        }

        update(deltaTime){
            //gameOver
            this.time += deltaTime;
            if (this.time > this.maxTime) {
                this.gameOver = true;
            }
            
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                //borra enemigos si estan fuera del canvasw
                if (enemy.markedForDeletion) {
                    //splice remueve 1 elemento del array con el argumento 1
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                }
            });

            //handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
                //borra 1 particulas
                if(particle.markedForDeletion){
                    this.particles.splice(index, 1);
                }
            });

            //fire
            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }         

            //handle collisions sprites
            this.collisions.forEach((collision, index) => {
                //delta time es para que se anime correctamente
                collision.update(deltaTime);
                if (collision.markedForDeletion) {
                    this.collisions.splice(index, 1);
                }
            });

            //handle floating messages
            this.floatingMessages.forEach(message => {
                message.update();               
            });

            //borra el floating text 
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });

            //particles
            this.particles.forEach(particle => {
                particle.draw(context);
            });

            //score
            this.UI.draw(context);

            //dibuja el boom
            this.collisions.forEach(collision => {
                collision.draw(context);
            });

            //dibuja el floating messageç
            this.floatingMessages.forEach(message => {
                message.draw(context);               
            });         
        }

        addEnemy(){
            //con push se agregan elementos al array
            this.enemies.push(new FlyingEnemy(this));
            // console.log(this.enemies);

            //si la velocidad del juego es 0 , agregar solo con probabilidad del 50% una planta
            if (this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this));
            }else if( this.speed > 0){
                this.enemies.push(new ClimbingEnemy(this));
            }
        }
    }

    const game = new Game(canvas.width, canvas.height);
    //console.log(game);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        //1000 / 60 fps deben dar 16, que es el valor del deltaTime
        //console.log(deltaTime);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);

        if (!game.gameOver) {
            requestAnimationFrame(animate);            
        }
    }
    animate(0);
});