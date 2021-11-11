const canvas = document.getElementById('game'); //linking javascript const to the html canvas
const ctx = canvas.getContext('2d');  //context is assigned canvas and 2D, can give 3D

class SnakePart {                
    constructor(x,y) {
        this.x = x;         //just setting values
        this.y = y;
    }
}


let speed = 7; //if you open console on browser and see drawgame there, it shows speed

let tileCount = 20;   //saying 20 tiles in the canvas across and 20 down
let tileSize = (canvas.width/tileCount)-5;    //size of the snake compared to the tiles

let headX = 10;      //position the head of the snake in middle of the screen - tile 10
let headY = 10;       //position the end of snake at middle as well
const snakeParts = [];  //we never remove this but only modify contents so we use CONST
let tailLength = 2;     //length of snake's tail with a beginning tail piece of 2

let appleX = 5;
let appleY = 5;

let xVelocity=0;  //these are variables to move the snake, values change based on arrows
let yVelocity=0;

let score = 0;

const HissSound = new Audio("SnakeHiss.mp3");
const GameOverMario = new Audio("GameOverMario.mp3");

function drawGame(){
    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return;
    }
   
    console.log('draw game');     //during creation, seeing the speed increase
    clearScreen();

    checkAppleCollison();
    drawApple();
    drawSnake();

    drawScore();

    if(score >2){
        speed = 11;
    }

    if(score>10){
        speed = 17;
    }

    if(score > 30){
        speed= 25;
    }

    if(score >50){
        speed = 37;
    }
    
    setTimeout(drawGame, 1000/speed);
}
//One of three can be used to update the Snake as game goes
//request Animation Frame
//setInterval xtimes per second
//setTimeOut


function isGameOver(){
    let gameOver= false;        //default is false that game is not over

    if (yVelocity ===0 && xVelocity ===0) { //saying if x and y velocity or no speed basically, game hasn't started and isn't over
        return false;
    }

//walls
    if(headX < 0){             //if left is less than 1 and hits wall, game over
        gameOver = true;
    }

    else if(headX === tileCount){               //right wall
        gameOver = true;
    }

    else if(headY < 0){                         //top wall
        gameOver = true;
    }

    else if(headY === tileCount){               //bottom wall
        gameOver = true;
    }

//can't hit own body, if we don't use the velocity if in row57, this will be gameover right away as body touches itself in beginning
    for (let i=0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x == headX && part.y == headY){
            gameOver=true;
            break;
        }    

    }

    if(gameOver) {
        GameOverMario.play();
        ctx.fillStyle = "white";
        ctx.font ="70px Impact";
//if game over this acts like an alert to show a pop up

//can use the graident effect below if we don't want the white effect from above
        const gradient = ctx.createLinearGradient(0,0,canvas.width,0);
        gradient.addColorStop("0", "red");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1", "purple");
        ctx.fillStyle=gradient;

        ctx.fillText("Game Over!", canvas.width/12, canvas.height/2);
    }
    return gameOver;
}

function drawScore() {
    ctx.fillStyle="pink";
    ctx.font= "10px Verdana";
    ctx.fillText ("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {  //styles below are way to give style without CSS
    ctx.fillStyle = 'olive';
    ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
}


function drawSnake() {

    ctx.fillStyle ='pink';
    for(let i=0; i < snakeParts.length; i++){
        let part = snakeParts[i];   //getting item from the snakeParts array item
            ctx.fillRect((part.x*tileCount), (part.y*tileCount), tileSize, tileSize); //the part.x and part.y are coming from the constructor class-row 5
    }

    //can use if below but using while so we can penalize if snake hits wall or itself
    snakeParts.push(new SnakePart(headX, headY)) //putting in positon of where head was
    while(snakeParts.length > tailLength){ //if snakepart length is greater than tail length we are removing the first item in the list; that's the furthest away from the head. being drawn in reveres so we remove first item
        snakeParts.shift();     //remove furthest item from snake parts if more than tail length
    }

    ctx.fillStyle = 'maroon';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
/*  ctx is referring to the canvas in 2D
-Rect is the shape of the snake (headX and headY * tileCount positoins in tile map)
-width and height are set to the tileSize
    */
}



function changeSnakePosition() {
    headX = headX + xVelocity;  //will change the head position
    headY = headY + yVelocity;
}
document.addEventListener('keydown', keyDown);


function drawApple(){
    ctx.fillStyle='white';
    ctx.fillRect((appleX * tileCount), (appleY * tileCount), tileSize, tileSize);
}

function checkAppleCollison(){  //code to move the white apple to each different random location
    if(appleX === headX && appleY === headY){
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        HissSound.play();  //plays the sound after taillength and score udpate
    }
}

function keyDown(event) {  //these event keycodes entered can be found online
    //up arrow
    if(event.keyCode == 38){ 
        if(yVelocity == 1)      //if this going up, you can't go down
            return;   
        yVelocity = -1;         //y will increase if we go down, -1 will decrease
        xVelocity = 0;          //will not move left or right
    }

    //down arrow
    if(event.keyCode == 40){ 
        if(yVelocity == -1)     //if this is going down, you can click up and go up
            return;   
        yVelocity = 1;         
        xVelocity = 0;          
    }

    //right arrow
    if(event.keyCode == 39){  
        if(xVelocity == -1)     //if you are going left, you can't go right
            return;  
        yVelocity = 0;         
        xVelocity = 1;          
    }

    //left arrow
    if(event.keyCode == 37){    
        if(xVelocity == 1)      //velocity 1 is going right, which is stopped here
            return;
        yVelocity = 0;         
        xVelocity = -1;          
    }
}
drawGame();