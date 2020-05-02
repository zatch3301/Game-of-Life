var rows =50;
var cols =100;


var playing = false;
 
var grid = new Array(rows);
var nexrGrid = new Array(rows);

var timer;
var reproductionTime = 100;

function initializeGrids(){
	for(var i=0;i<rows;i++){
		grid[i] = new Array(cols);
		nexrGrid[i] = new  Array(cols);
	}
}

function resetGrids(){
	for(var i=0;i<rows;i++){
		for(var j=0;j<cols;j++){
			grid[i][j] = 0;
			nexrGrid[i][j] = 0;
		}
	}
}

function copyAndResetGrid(){
	for(var i=0;i<rows;i++){
		for(var j=0;j<cols;j++){
			grid[i][j] = nexrGrid[i][j];
			nexrGrid[i][j] = 0;
		}
	}
}

//Initialize

function initialize(){
	createTable();
	initializeGrids();
	resetGrids();
	setupControlButton();
}

 //Layout the board 

function createTable(){
	var gridContainer = document.getElementById('gridContainer');
	if(!gridContainer){
		console.error("Problem; No Div for the grid table!");
	}
	var table = document.createElement("table");

	for(var i=0;i<rows;i++){
		var tr = document.createElement("tr");
		for(var j=0;j<cols;j++){
		var cell = document.createElement("td");
		cell.setAttribute("id",i+"_"+j);
		cell.setAttribute("class","dead");
		cell.onclick = cellClickHandler;
		tr.appendChild(cell);
		}
		table.appendChild(tr);
	}
	gridContainer.appendChild(table);
}


function cellClickHandler(){
	var rowcol = this.id.split("_");
	var row = rowcol[0];
	var col = rowcol[1];

	var classes = this.getAttribute("class");
	if(classes.indexOf("live")>-1){
		this.setAttribute("class","dead");
		grid[row][col] = 0;
	}else{
		this.setAttribute("class","live");
		grid[row][col] = 1;
	}
}


function updateViews(){
		for(var i=0;i<rows;i++){
			for(var j=0;j<cols;j++){
			var cell = document.getElementById(i+"_"+j);
			if(grid[i][j] == 0){
				cell.setAttribute("class", "dead");
			}else{
				cell.setAttribute("class", "live");
			}
		}
	}
}


function setupControlButton(){
	//button to star
	var startButton = document.getElementById('start');
	startButton.onclick = startButtonHandler;

	//button to clear
	var clearButton = document.getElementById('clear');
	clearButton.onclick = clearButtonHandler;

	//button to set random state
	var randomButton = document.getElementById('random');
	randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler(){
	if(playing) return;
	clearButtonHandler();
		for(var i=0;i<rows;i++){
			for(var j=0;j<cols;j++){
			var isLive = Math.round(Math.random());
			if(isLive == 1){
				var cell = document.getElementById(i+"_"+j);
				cell.setAttribute("class","live");
				grid[i][j] = 1;
			}
		}
	}
}

//clear grid

function clearButtonHandler(){
	console.log("Clear the game: Stop playing , clear the grid");

	playing = false;
	var startButton = document.getElementById('start');
	startButton.innerHTML = "Start";
	clearTimeout(timer);

	var cellsList = document.getElementsByClassName("live");
	// convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    var cells =[];
     for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids;

}

//start/pause/continue the game
function startButtonHandler(){
	if(playing){
		console.log("pause the game");
		playing = false;
		this.innerHTML = "Continue";
		clearTimeout(timer);
	}else{
		console.log("Continue the game");
		playing = true;
		this.innerHTML = "Pause";
		play();
	}
}

//run the game
function play(){
	computeNextGen();

	if(playing){
		timer = setTimeout(play, reproductionTime);
	}
}


function computeNextGen(){
	for(var i=0;i<rows;i++){
		for(var j=0;j<cols;j++){
			applyRules(i,j);
		}
	}

	// copy nexrGrid to grid, and reset nexrGrid
	copyAndResetGrid();
	// copy all 1 values to "live" in the table
	updateViews();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nexrGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nexrGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nexrGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nexrGrid[row][col] = 1;
            }
        }
    }
    
function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}

//Start everything
window.onload = initialize;