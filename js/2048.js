/*
 * Bot for http://gabrielecirulli.github.io/2048/
 * Usage: Add this as a bookmark: 
 * javascript:(function(){var s=document.createElement("script");s.src="http://both00z.github.io/js/2048.js";document.getElementsByTagName('head')[0].appendChild(s);s.addEventListener('load',function(e){solve(4,5,2);},false);}());
 * On the game page, click the bookmark.
 * Tested on Chrome
 */

var getNextBoard = function (currentBoard, dir) {
	var board = copyBoard(currentBoard);

	switch (dir) {
		case 'left':
			return moveLeft(board);
		case 'right':
			return moveRight(board);
		case 'up':
			return moveUp(board);
			break;
		case 'down':
			return moveDown(board);
			break;
	}
	
	return board;
}

var moveLeft = function (board) {
	var x, y, moveTo,
		size = board.length;
		
	for (y = 0; y < size; y++) {
		moveTo = -1;
		x = 0;
		merged = -1;
		
		while (x < size) {
			if (moveTo == -1 && board[x][y] == 0) {
				moveTo = x;
			} else if (moveTo != -1 && board[x][y] != 0) {
				board[moveTo][y] = board[x][y];
				board[x][y] = 0;
				x = moveTo > 0 ? moveTo - 1 : 0;
				moveTo = -1;
				continue;
			} else if (x < size - 1 && board[x + 1][y] == board[x][y] && merged != x) {
				board[x][y] = board[x + 1][y] + board[x][y];
				board[x + 1][y] = 0;
				merged = x;
			}
			x++;
		}
	}
	return board;
}

var moveRight = function (board) {
	var x, y, moveTo,
		size = board.length;
	
	for (y = 0; y < size; y++) {
		moveTo = -1;		
		x = size - 1;
		merged = -1;
		
		while (x >= 0) {
			if (moveTo == -1 && board[x][y] == 0) {
				moveTo = x;
			} else if (moveTo != -1 && board[x][y] != 0) {
				board[moveTo][y] = board[x][y];
				board[x][y] = 0;
				x = moveTo < size - 1 ? moveTo + 1 : size - 1;
				moveTo = -1;
				continue;
			} else if (x > 0 && board[x - 1][y] == board[x][y] && merged != x) {
				board[x][y] = board[x - 1][y] + board[x][y];
				board[x - 1][y] = 0;
				merged = x;
			}
			x--;
		}
	}
	
	return board;
}

var moveUp = function (board) {
	var x, y, moveTo,
		size = board.length;
	
	for (x = 0; x < size; x++) {
		moveTo = -1;
		y = 0;
		merged = -1;
		
		while (y < size) {
			if (moveTo == -1 && board[x][y] == 0) {
				moveTo = y;
			} else if (moveTo != -1 && board[x][y] != 0) {
				board[x][moveTo] = board[x][y];
				board[x][y] = 0;
				y = moveTo > 0 ? moveTo - 1 : 0;
				moveTo = -1;
				continue;
			} else if (y < size - 1 && board[x][y + 1] == board[x][y] && merged != y) {
				board[x][y] = board[x][y + 1] + board[x][y];
				board[x][y + 1] = 0;
				merged = y;
			}
			y++;
		}
	}
	
	return board;
}

var moveDown = function (board) {
	var x, y, moveTo,
		size = board.length;
	
	for (x = 0; x < size; x++) {
		moveTo = -1;
		y = size - 1;
		merged = -1;
		
		while (y >= 0) {
			if (moveTo == -1 && board[x][y] == 0) {
				moveTo = y;
			} else if (moveTo != -1 && board[x][y] != 0) {
				board[x][moveTo] = board[x][y];
				board[x][y] = 0;
				y = moveTo < size - 1 ? moveTo + 1 : size - 1;
				moveTo = -1;
				continue;
			} else if (y > 0 && board[x][y - 1] == board[x][y] && merged != y) {
				board[x][y] = board[x][y - 1] + board[x][y];
				board[x][y - 1] = 0;
				merged = y;
			}
			y--;
		}
	}
	
	return board;
}

var copyBoard = function(board) {
	var size = board.length,
		result = new Array(size);
	for (var i = 0; i < size; i++) {
		result[i] = new Array(size);
		for (var j = 0; j < size; j++) {
			result[i][j] = board[i][j];
		}
	}
	
	return result;
}

var getEmptyBoard = function (size) {
	var board = new Array(size);
	for (var i = 0; i < size; i++) {
		board[i] = new Array(size);
		for (var j = 0; j < size; j++) {
			board[i][j] = 0;
		}
	}
	
	return board;
}

var evaluateBoard = function (board) {
	var count = 0;

	for (var i in board){
		for (var j in board[i]){
			if (board[i][j]) count += 1;
		}
	}
	
	return Math.pow(board.length, 2) - count;
}

var scrapeBoard = function (size) {
	var board = getEmptyBoard(size);
	var children = document.getElementsByClassName('tile-container')[0].children;
	
	for (var i = 0; i < children.length; i++) {
		var el = children[i],
			cls = el.className,
			val = cls.match(/tile-(\d+)/)[1],
			coords = cls.match(/tile-position-(\d+)-(\d+)/);
			
		board[Number(coords[1])-1][Number(coords[2])-1] = Number(val);
	}
	
	return board;
}

var areEqual = function (b1, b2) {
	var size = b1.length;
	for (var x = 0; x < size; x++) {
		for (var y = 0; y < size; y++) {
			if (b1[x][y] != b2[x][y]) return false;
		}
	}
	return true;
}

var getRandomBoards = function (board) {
	var size = board.length,
		result = [],
		emptyCoords = [],
		possibleVals = [2, 4],
		x, y;
	
	for (x = 0; x < size; x++) {
		for (y = 0; y < size; y++) {
			if (board[x][y] == 0) emptyCoords.push([x, y]);
		}
	}
	
	if (!emptyCoords.length)
		return [];
	
	for (var j in possibleVals) {
		var val = possibleVals[j];
		
		for (var i in emptyCoords) {
			var coords = emptyCoords[i];
			var newBoard = copyBoard(board);
			newBoard[coords[0]][coords[1]] = val;
			result.push(newBoard);
		}
	}
	
	return result;
}

var evaluateMove = function (board, current, maxLookAhead, maxRandomPredict) {
	if (current == maxLookAhead )
		return 0;
	
	var weight = evaluateBoard(board);
	var dirs = ['left','right','up','down'];
	var max = -1;
	var maxDir = null;
	
	var possibleBoards;
	if (current <= maxRandomPredict) { //predict possible boards only on the first step
		possibleBoards = getRandomBoards(board);
	} else {
		possibleBoards = [board];
	}
	
	for (var i in dirs){
		var dir = dirs[i];
		var nextW = 0;
		
		for (var bI in possibleBoards)
		{
			var possibleBoard = possibleBoards[bI];			
			var nextBoard = getNextBoard(possibleBoard, dir);
			
			if (areEqual(board, nextBoard))
				continue;
				
			nextW += evaluateMove(nextBoard, current + 1, maxLookAhead, maxRandomPredict);				
		}
		
		if (nextW > max)
			max = nextW;
	}
	
	if (max == -1)
		return 0;
	
	return max + weight;
}

/*
 * Main entry point
 * @size - the size of the board (default: 4)
 * @maxLookAhead - how many steps to look ahead before making a move (default: 5)
 * @maxRandomPredict - how many steps ahead should take random tile into account (default: 1) - can affect performance
 */
var solve = function (size, maxLookAhead, maxRandomPredict) {
	if (!size) size = 4;
	if (!maxLookAhead) maxLookAhead = 3;
	if (!maxRandomPredict) maxRandomPredict = 1;

	setTimeout(function () {
		var board = scrapeBoard(size);
		var dirs = ['left','right','up','down'];
		var max = -1;
		var maxDir = null;
		
		for (var i in dirs){
			var dir = dirs[i];
			var nextBoard = getNextBoard(board, dir);
			
			if (areEqual(board, nextBoard))
				continue;
				
			var nextW = evaluateMove(nextBoard, 1, maxLookAhead, maxRandomPredict);
			if (nextW == -1)
				continue;
				
			if (nextW > max)
			{
				max = nextW;
				maxDir = dir;
			}
		}
		
		if (maxDir) {
			var e = new Event('keydown');
			e.initEvent('keydown', true, true);
			
			switch (maxDir){
				case 'left':
					e.which = 37;
					break;
				case 'up':
					e.which = 38;
					break;
				case 'right':
					e.which = 39;
					break;
				case 'down':
					e.which = 40;
					break;
			}
			
			document.body.dispatchEvent(e);
			solve(size, maxLookAhead, maxRandomPredict);
		} else {
			console.log('no more moves?');
		}
	}, 500);
}