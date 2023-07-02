var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedY = 4;
var ballSpeedX = 10;
var ballRadius = 5;

var player1Score = 0;
var player2Score = 0;
const winningScore = 5;

var showingWinScreen = false;
var showingStartScreen = true;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICHKNESS = 8;


function calculateMousePos (evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	};
}
function handleMouseClick(evt){
	if (showingWinScreen){
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

function handleMouseStart(evt){
    if(showingStartScreen){
        canvasContext.fillStyle='white';
        canvasContext.fillText("Start Game?", canvas.width/2-20, canvas.height/2-10);
        showingStartScreen = false;
    }
    return;
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	var framePerSecond = 30;
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000/framePerSecond);
	
	canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mouseup',handleMouseStart);
	canvas.addEventListener('mousemove',
		function(evt){
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT)/2;
		});
}
function ballReset() {
	if (player1Score>= winningScore || player2Score>= winningScore){
		showingWinScreen = true;
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}
function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY-35) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY+35) {
		paddle2Y -= 6;
	}
}
function moveEverything() {
	
	if (showingWinScreen){
		return;
	}
	computerMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;
	if (ballX > canvas.width){
		if (ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
		ballSpeedX = -ballSpeedX;
		
		var deltaY = ballY - (paddle2Y+ PADDLE_HEIGHT/2);
		ballSpeedY = deltaY*0.35;
	} else {
		player1Score++;
		ballReset();
		
	}
	}
	if (ballX < 0){
		if (ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
		ballSpeedX = -ballSpeedX;
		var deltaY = ballY - (paddle1Y+ PADDLE_HEIGHT/2);
		ballSpeedY = deltaY*0.35;
	} else {
		player2Score++;
		ballReset();
	
	}
	}
	if (ballY > canvas.height){
		ballSpeedY = -ballSpeedY;
	}
	if (ballY< 0){
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet(){
	for (var i = 0; i< canvas.height; i+=40){
		colorRect(canvas.width/2-1, i, 2, 20, 'white');
	}
}
function drawEverything() {
	// black canvas
	colorRect(0,0,canvas.width,canvas.height,'black');
	if (showingStartScreen){
        canvasContext.fillStyle ='white';
        canvasContext.fillText("Start Game", canvas.width/2-20, canvas.height/2-10);
        return;
    }
	if (showingWinScreen){
		canvasContext.fillStyle = 'white';
		if (player1Score >= winningScore){
			canvasContext.fillText("PLAYER 1 WON", canvas.width/2-20, canvas.height/2-10);
		} else if (player2Score >= winningScore){
			canvasContext.fillText("PLAYER 2 WON", canvas.width/2-20, canvas.height/2-10);
	}
		canvasContext.fillText("Click to continue", canvas.width/2-20, canvas.height*2/3);
		return;
	}
	
	drawNet();
	
	// left paddle
	colorRect(0,paddle1Y,PADDLE_THICHKNESS,PADDLE_HEIGHT,'white');
	// right paddle
	colorRect(canvas.width-PADDLE_THICHKNESS,paddle2Y,PADDLE_THICHKNESS,PADDLE_HEIGHT,'white');
	// the ball
	colorCircle(ballX, ballY, ballRadius, 'white');
	
	canvasContext.fillText("Player 1: " + player1Score, 100, 100);
	canvasContext.fillText("Player 2: " + player2Score, 450, 100);
}

function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY,width,height,drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);	
}