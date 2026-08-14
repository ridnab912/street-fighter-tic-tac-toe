// JAVASCRIPT FOR TIC TAC TOE

//global variables that track player stuff
var players = [];
var markers = ["X","O"];
var whoseTurn = 0;
var gameMessage;
var hp1;
var hp2;

//global variable to track win values
var winValues = [7,56,73,84,146,273,292,448];

//global variables that reset each game
var gameOver;
var points = [];
var catsGame;
var round;
var p1Score;
var p2Score;

var p1Sound = new Audio();
var p2Sound = new Audio();
var fightSound = new Audio();
var winSound = new Audio();
var stageSound = new Audio();
//stageSound.loop = true;
//var stageMusicStarted = false;
p1Sound.src = "sound/hadouken.wav";
p2Sound.src = "sound/shoryuken.wav";
fightSound.src = "sound/fight.wav";
winSound.src = "sound/win.wav";


/******************************************************************************/

//resets game
function reset() {
	getNames();
	updateTurn();
	var random = Math.ceil(Math.random()*3);
	document.body.style.backgroundImage = "url('img/bg-"+random+".jpg')";
	stageSound.src = "sound/theme"+random+"(new).mp3";
	stageSound.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
	}, false);
	stageSound.play();
	gameOver = false;
	catsGame = false;
	points = [0,0];
	drawBoard();
	round = 0;
	p1Score = 0;
	p2Score = 0;
}

function getNames() {
	players[0] = prompt("Enter Player 1", "Ryu");
	players[1] = prompt("Enter Player 2", "Ken");
}

function drawBoard() {
	var display = "";
	var binaryCount = 1;
	gameOver = false;
	catsGame = false;
	
	for (var i = 1; i <= 3; i++) {
		display += '<div id="row-'+i+'">';
		for (var j = 0; j < 3; j++) {
			display += '<div onclick="play(this, '+binaryCount+');">&nbsp;</div>';
			binaryCount *= 2;
		}
		display += '</div>';
	}
	document.getElementById("game-board").innerHTML = display;
}

function drawHealth() {
	var display1 = '';
	var display2 = '';
	hp1 = 6;
	hp2 = 6;
	
	for (var i = 1; i <= 6; i++) {
		display1 += '<div id="p1-section-'+i+'"></div>';
		display2 += '<div id="p2-section-'+i+'"></div>';
	}
	document.getElementById("p1-health-bar").innerHTML = display1;
	document.getElementById("p2-health-bar").innerHTML = display2;
}

function ko() {
	for (var i = 1; i <= 6; i++) {
		if (whoseTurn == 0) document.getElementById("p2-section-"+i).style.backgroundColor = "#f0ad06";
		else document.getElementById("p1-section-"+i).style.backgroundColor = "#f0ad06";
	}
}

function pointCount(userPoints) {
	points[whoseTurn] += userPoints;
}

function referee() {
	for (var i = 0; i < winValues.length; i++) {
		if ((winValues[i] & points[whoseTurn]) == winValues[i]) {
			gameOver = true;
			if (whoseTurn == 0) {
				if (p1Score <= 1) {
					changeGif("round2-ryu");						
					document.getElementById("p1-v-" + p1Score).innerHTML = "V";
					document.getElementById("p1-v-" + p1Score).style.border = "1px solid black";
					document.getElementById("p1-v-" + p1Score).style.backgroundColor = "#CC2229";
				}
			} else {
				if (p2Score <= 1) {
					changeGif("round2-ken");
					document.getElementById("p2-v-" + p2Score).innerHTML = "V";
					document.getElementById("p2-v-" + p2Score).style.border = "1px solid black";
					document.getElementById("p2-v-" + p2Score).style.backgroundColor = "#CC2229";
				}
			}
			document.getElementById("game-msg").style.display = "block";
			if (round == 3 || p1Score == 2 || p2Score == 2) { 
				if (p1Score > p2Score) changeGif("ryu-wins");
				else changeGif("ken-wins");
				winSound.play();
				document.getElementById("btn").className = "hide";
				document.getElementById("btn-reset").className = "";
			}
			updateTurn(players[whoseTurn] + " Wins!");
		}
	}
	if (((points[0] + points[1]) == 511) && !gameOver) {
		catsGame = true;
		gameOver = true;
		document.getElementById("game-msg").style.display = "block";
		document.getElementById("msg-gif").src = "img/cats-game.gif";
		document.getElementById("round").innerText = "DRAW!";
		points[0] = 0;
		points[1] = 0;
		drawBoard();
		updateTurn();
	}
	return gameOver;
}

function play(clickedDiv, divPoints) {
	if (!gameOver && clickedDiv.innerHTML == "&nbsp;") {
		pointCount(divPoints);
		clickedDiv.innerHTML = "<span>" + markers[whoseTurn] + "</span>";
		referee();
		if (whoseTurn == 0) {
			document.getElementById('p2-section-'+hp2).style.backgroundColor = "rgb(240, 173, 6)";
			p1Sound.play();
			hp2--;
		} else {
			document.getElementById('p1-section-'+hp1).style.backgroundColor = "rgb(240, 173, 6)";
			p2Sound.play();
			hp1--;
		}
		if (!referee()) {togglePlayer();}
	}
}

function updateTurn(text = false) {
	if (text) {document.getElementById("turn").innerText = text;}
	else {document.getElementById("turn").innerText = players[whoseTurn] + "'s Turn!";}
}

function togglePlayer() {	
	if (whoseTurn == 0) {
		whoseTurn = 1;
		document.getElementById("ryu").src = "img/p1-strike.gif";
		document.getElementById("ken").src = "img/p2-default.gif";
		
		setTimeout(() => {
			document.getElementById("ryu").src = "img/p1-default.gif";
		}, 2500);
	}
	else {
		whoseTurn = 0;
		document.getElementById("ryu").src = "img/p1-default.gif";
		document.getElementById("ken").src = "img/p2-strike.gif";
		
		setTimeout(() => {
			document.getElementById("ken").src = "img/p2-default.gif";
		}, 2500);
	}
	updateTurn(players[whoseTurn] + "'s Turn!");
}

function hide() {
	var x = document.getElementById("game-msg");
	drawHealth();
	fightSound.play();
	//if (!stageMusicStarted) {
		stageSound.play();
	//	stageMusicStarted = true;
	//}
	if (x.style.display == "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

function changeGif(result) {
	var imgName = "";
	var caption = "";
	
	if (!catsGame) {
		switch (result) {
			case "round2-ryu": 
				imgName = "p1-wins.gif";
				caption = "NEXT ROUND";
				p1Score += 1;
			break;
			case "round2-ken": 
				imgName = "p2-wins.gif";
				caption = "NEXT ROUND";
				p2Score += 1;
			break;
			case "ryu-wins": 
				imgName = "p1-wins.gif";
				caption = players[0] + " Wins!";
			break;
			case "ken-wins": 
				imgName = "p2-wins.gif";
				caption = players[1] + " Wins!";
			break;
		}
		document.getElementById("msg-gif").src = "img/" + imgName;
		document.getElementById("round").innerText = caption;
		points[0] = 0;
		points[1] = 0;
		ko();
		drawBoard();
		gameOver = false;
		catsGame = false;
		updateTurn();
		round += 1;
	}
}
