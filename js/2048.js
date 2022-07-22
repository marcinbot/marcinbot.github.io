/*
 * Bot for http://gabrielecirulli.github.io/2048/
 * Usage: Add this as a bookmark:
 * javascript:(function(){let s=document.createElement("script");s.src="http://marcinbot.github.io/js/2048.js";document.getElementsByTagName('head')[0].appendChild(s);s.addEventListener('load',function(e){solve(4,5,2);},false);}());
 * On the game page, click the bookmark.
 * Tested on Chrome
 */

const getNextBoard = function (currentBoard, dir) {
	let board = copyBoard(currentBoard);

	switch (dir) {
		case 'left':
			return moveLeft(board);
		case 'right':
			return moveRight(board);
		case 'up':
			return moveUp(board);
		case 'down':
			return moveDown(board);
	}

	return board;
};

const moveLeft = function (board) {
	let x, y, moveTo, merged,
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
};

const moveRight = function (board) {
	let x, y, moveTo, merged,
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
};

const moveUp = function (board) {
	let x, y, moveTo, merged,
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
};

const moveDown = function (board) {
	let x, y, moveTo, merged,
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
};

const copyBoard = function(board) {
	return board.map( ( arr ) => [ ...arr ] );
};

const getEmptyBoard = function (size) {
	let board = [];
	for (let i = 0; i < size; i++) {
		board.push(Array(size).fill(0));
	}

	return board;
};

const getChainLength = function ( board, x, y, prev, visited, stack ) {
	if ( x < 0 || y < 0 || x >= board.length || y >= board.length || visited[x][y] ) {
		return 0;
	}

	const [ stackTop, ...newStack ] = stack;
	const current = board[x][y];
	if ( ! current || current > prev || current !== stackTop ) {
		return 0;
	}

	const newVisited = copyBoard( visited );
	newVisited[x][y] = 1;

	const left = getChainLength( board, x - 1, y, current, newVisited, newStack );
	const right = getChainLength( board, x + 1, y, current, newVisited, newStack );
	const top = getChainLength( board, x, y - 1, current, newVisited, newStack );
	const bottom = getChainLength( board, x, y + 1, current, newVisited, newStack );

	return 1 + Math.max( left, right, top, bottom );
};

const evaluateBoard = function (board) {
	const size = board.length;
	const values = [];
	let tileSum = 0;
	let emptyCount = 0;
	let maxValue = -1;
	let maxValueDistToCorner, maxX, maxY;

	for (let x in board){
		for (let y in board[x]){
			let val = board[x][y];
			if ( val === 0 ) {
				emptyCount++;
				continue;
			}

			tileSum += val;
			values.push( val );

			const distToCorner = Math.sqrt( Math.pow( size - x, 2 ) + Math.pow( -y, 2 ) );

			if ( val > maxValue || ( val === maxValue && distToCorner < maxValueDistToCorner ) ) {
				maxValue = val;
				maxValueDistToCorner = distToCorner;
				maxX = Number( x );
				maxY = Number( y );
			}
		}
	}

	values.sort( ( a, b ) => b - a );
	const chainLength = getChainLength( board, maxX, maxY, maxValue + 1, getEmptyBoard( size ), values );

	const nonEmptyCount = size * size - emptyCount;

	const score = maxValueDistToCorner * 10000 + chainLength * 1000 + emptyCount * 100 + tileSum / nonEmptyCount;
	return score;
};

const scrapeBoard = function (size) {
	let board = getEmptyBoard(size);
	let children = document.getElementsByClassName('tile-container')[0].children;

	for (let i = 0; i < children.length; i++) {
		let el = children[i],
			cls = el.className,
			val = cls.match(/tile-(\d+)/)[1],
			coords = cls.match(/tile-position-(\d+)-(\d+)/);

		board[Number(coords[1])-1][Number(coords[2])-1] = Number(val);
	}

	return board;
};

const areEqual = function (b1, b2) {
	return b1.every( ( row, x ) => {
		return row.every( ( val, y ) => {
			return val === b2[x][y];
		} );
	} );
};

const getRandomBoards = function (board) {
	let size = board.length,
		result = [],
		emptyCoords = [],
		possibleVals = [2, 4],
		x, y;

	for (x = 0; x < size; x++) {
		for (y = 0; y < size; y++) {
			if (board[x][y] == 0) {
				emptyCoords.push([x, y]);
			}
		}
	}

	if (!emptyCoords.length) {
		return [];
	}

	for (let j in possibleVals) {
		const val = possibleVals[j];

		for (let i in emptyCoords) {
			const coords = emptyCoords[i];
			const newBoard = copyBoard(board);
			newBoard[coords[0]][coords[1]] = val;
			result.push(newBoard);
		}
	}

	return result;
};

const evaluateMove = function (board, current, maxLookAhead, maxRandomPredict) {
	if (current == maxLookAhead ) {
		return 0;
	}

	let weight = evaluateBoard(board);
	let dirs = ['left','right','up','down'];
	let max = -1;

	let possibleBoards;
	if (current <= maxRandomPredict) { //predict possible boards only on the first step
		possibleBoards = getRandomBoards(board);
	} else {
		possibleBoards = [board];
	}

	for (let i in dirs){
		let dir = dirs[i];
		let nextW = 0;

		for (let bI in possibleBoards)
		{
			let possibleBoard = possibleBoards[bI];
			let nextBoard = getNextBoard(possibleBoard, dir);

			if (areEqual(board, nextBoard)) {
				continue;
			}

			nextW += evaluateMove(nextBoard, current + 1, maxLookAhead, maxRandomPredict);
		}

		if (nextW > max) {
			max = nextW;
		}
	}

	if (max == -1) {
		return 0;
	}

	return max + weight;
};

/*
 * Main entry point
 * @size - the size of the board (default: 4)
 * @maxLookAhead - how many steps to look ahead before making a move (default: 5)
 * @maxRandomPredict - how many steps ahead should take random tile into account (default: 1) - can affect performance
 */
const solve = function (size, maxLookAhead, maxRandomPredict) {
	if (!size) {
		size = 4;
	}
	if (!maxLookAhead) {
		maxLookAhead = 3;
	}
	if (!maxRandomPredict) {
		maxRandomPredict = 1;
	}

	setTimeout(function () {
		let board = scrapeBoard(size);
		let dirs = ['left','right','up','down'];
		let max = -1;
		let maxDir = null;

		for (let i in dirs){
			let dir = dirs[i];
			let nextBoard = getNextBoard(board, dir);

			if (areEqual(board, nextBoard)) {
				continue;
			}

			let nextW = evaluateMove(nextBoard, 1, maxLookAhead, maxRandomPredict);
			if (nextW == -1) {
				continue;
			}

			if (nextW > max)
			{
				max = nextW;
				maxDir = dir;
			}
		}

		if (maxDir) {
			let e = new Event('keydown');
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
};

window.solve = solve;
