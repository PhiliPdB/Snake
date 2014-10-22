// Snake
// By: Philip de Bruin
// Last edit: 10/22/2014

// Variables
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	width = canvas.width, height = canvas.height,
	score = 0, snake = {} /* The snake*/, food = {}, interval;

window.onload = function () {
	// Setup player controls
	document.addEventListener("keydown", function(event) {
		if (event.keyCode == 37 && snake.direction != 'right') snake.direction = 'left';
		else if (event.keyCode == 38 && snake.direction != 'down') snake.direction = 'up';
		else if (event.keyCode == 39 && snake.direction != 'left') snake.direction = 'right';
		else if (event.keyCode == 40 && snake.direction != 'up') snake.direction = 'down';
	});
	document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchmove', handleTouchMove, false);

	// Check if screen is smaller than canvas
	if ((window.innerHeight <= height || window.innerWidth <= width) && !window.navigator.standalone) {
		height = window.innerHeight;
		width = window.innerWidth;
		canvas.height = height;
		canvas.width = width;
	}

	// check if game is running in web app mode
	if (window.navigator.standalone) {
		document.body.style.marginTop = "20px";
		document.body.style.backgroundColor = "#000000";
		height = window.innerHeight - 20;
		width = window.innerWidth;
		canvas.height = height;
		canvas.width = width;
		canvas.style.border = 0;
		canvas.style.borderTop = "1px solid black";
		canvas.style.maxHeight = height + "px";
		canvas.style.maxWidth = width + "px";
	}

	// Setup game
	init();
};

window.onresize = function() {
	if (window.innerHeight <= height || window.innerWidth <= width) {
		height = window.innerHeight;
		width = window.innerWidth;
		canvas.height = height;
		canvas.width = width;
	}
}

function init() {
	snake = { // The snake
		array: [], // Array with the cells of the snake
		length: 5, // Default length of the snake
		direction: "right", // The direction the snake goes && default direction is right
		blockWidth: 10 // The width of cells of the snake
	};

	if ((window.innerHeight <= height || window.innerWidth <= width) &&
		(width % 10 != 0 || height % 10 != 0) &&
		(width % 8 == 0 || height % 8 == 0)) snake.blockWidth = 8;

	createSnake();
	createFood();
	interval = setInterval(draw, 60);
};

// Create the snake
function createSnake() {
	for (var i = snake.length - 1; i >= 0; i--) snake.array.push({x:i,y:0});
};

// Create the food
function createFood() {
	food = {
		x: Math.round(Math.random() * (width - snake.blockWidth) / snake.blockWidth),
		y: Math.round(Math.random() * (height - snake.blockWidth) / snake.blockWidth),
	};
};

// Draw canvas
function draw() {
	// Reset board every time
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,width,height);
	ctx.fillStyle = "black";
	ctx.font = "Roboto 20px";
	ctx.fillText("Score: " + score, 5, height - 5);

	// Update the snake
	var nx = snake.array[0].x, // x location of first block
		ny = snake.array[0].y; // y location of first block

	// update location
	if (snake.direction == 'right') nx++;
	else if (snake.direction == 'down') ny++;
	else if (snake.direction == 'left') nx--;
	else if (snake.direction == 'up') ny--;

	// Gameover function restarts the game
	if (nx == -1 || nx >= width / snake.blockWidth || ny == -1 || ny >= height / snake.blockWidth || checkCollision(nx,ny,snake.array)) {
		clearInterval(interval);
		score = 0;
		init();
		return;
	}

	// If snake eats the food
	if (nx == food.x && ny == food.y) {
		// Set new head block. Let's the snake grow.
		var lastBlock = {x:nx,y:ny};
		score++;
		createFood();
	} else {
		// set last block to new location
		var lastBlock = snake.array.pop(); // Pops out last block
		lastBlock.x = nx;
		lastBlock.y = ny;
	}

	snake.array.unshift(lastBlock); // Puts block back as first block

	// Draw snake
	for (var i in snake.array) {
		var b = snake.array[i];
		drawBlock(b.x, b.y);
	};

	// draw food
	drawBlock(food.x, food.y);
};

// Generic draw block function
function drawBlock(x,y) {
	var bw = snake.blockWidth;
	ctx.fillStyle = "black";
	ctx.fillRect(x*bw,y*bw,bw,bw);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*bw,y*bw,bw,bw);
};

function checkCollision(x,y,array) {
	for (var i in array) {
		if (x == array[i].x && y == array[i].y) return true;
	}
};

// Swipe functionality
var xDown = null, yDown = null;

function handleTouchStart(event) {
	event.preventDefault(event);
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
};

function handleTouchMove(event) {
	event.preventDefault(event);
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = event.touches[0].clientX;
    var yUp = event.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
            if (snake.direction != 'right') snake.direction = 'left';
        } else {
            /* right swipe */
            if (snake.direction != 'left') snake.direction = 'right';
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
            if (snake.direction != 'down') snake.direction = 'up';
        } else { 
            /* down swipe */
            if (snake.direction != 'up') snake.direction = 'down';
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};