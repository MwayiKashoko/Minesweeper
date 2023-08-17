const pi = Math.PI;

function random(min, max) {
	return Math.floor(Math.random()*(max-min+1))+min;
}

function setColor(block) {
	switch (block.minesAround) {
		case 1:
			graphics.fillStyle = "blue";
			break;
		case 2:
			graphics.fillStyle = "green";
			break;
		case 3:
			graphics.fillStyle = "red";
			break;
		case 4:
			graphics.fillStyle = "darkblue";
			break;
		case 5:
			graphics.fillStyle = "maroon";
			break;
		case 6:
			graphics.fillStyle = "darkturquoise";
			break;
		case 7:
			graphics.fillStyle = "black";
			break;
		case 8:
			graphics.fillStyle = "gray";
			break;
	}
}

function Block(row, column) {
	this.row = row;
	this.column = column;
	this.width = mineWidth;
	this.height = mineHeight;
	this.containsMine = false;
	this.minesAround = 0;
	this.revealed = false;
	this.checkedForMinesAround = false;
	this.flagged = false;
}

Block.prototype.draw = function() {
	graphics.fillStyle = "gray";

	if (this.revealed) {
		graphics.fillStyle = "white";
	}

	if (this == highlightedGrid) {
		graphics.fillStyle = "#B0B0B0";

		if (this.revealed) {
			graphics.fillStyle = "#E0E0E0";
		}
	}

	graphics.strokeStyle = "black";
	graphics.beginPath();
	graphics.rect(this.column*this.width, this.row*this.height, this.width, this.height);
	graphics.fill();
	graphics.stroke();

	if (this.revealed && this.minesAround > 0) {
		if (this.containsMine) {
			graphics.fillStyle = "black";
			graphics.beginPath();
			graphics.arc(this.column*this.width+(this.width/2), this.row*this.height+(this.height/2), this.width/4, 0, pi*2);
			graphics.fill();
		} else {
			setColor(this);
			graphics.font = `${this.width/2}px sans-serif`;
			graphics.textAlign = "center";
			graphics.fillText(this.minesAround, this.column*this.width+(this.width/2), this.row*this.height+(this.height/2+10));
		}
	}

	if (this.flagged) {
		graphics.fillStyle = "red";
		graphics.beginPath();
		graphics.arc(this.column*this.width+(this.width/2), this.row*this.height+(this.height/2), this.width/4, 0, pi*2);
		graphics.fill();
	}
}

Block.prototype.revealSpace = function() {
	this.checkedForMinesAround = true;
	this.revealed = true;

	if (this.containsMine || this.minesAround != 0) {
		return;
	}

	for (let i = this.row-1; i <= this.row+1; i++) {
		if (i >= 0 && i < grid.length) {
			for (let j = this.column-1; j <= this.column+1; j++) {
				if (j >= 0 && j < grid[0].length && !(i == this.row && j == this.column)) {
					if (!grid[i][j].containsMine) {
						if (!grid[i][j].checkedForMinesAround && !grid[i][j].revealed) {
							grid[i][j].revealSpace();
						}
					}
				}
			}
		}
	}
}