// Enemies our player must avoid
var Enemy = function (x, y, speed, row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.row = row;
    this.speed = speed;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < ctx.canvas.width) {
        this.x += (this.speed * dt);
    } else {
        this.x = -100;
    }
}

// return the left edge of the enemy object (for collision detection)
Enemy.prototype.left = function () {
    var left = this.x + 30;
    return left;
}

// return the right edge of the enemy object (for collision detection)
Enemy.prototype.right = function () {
    var right = this.x + 70;
    return right;
}

// return the row of the enemy object (for collision detection)
Enemy.prototype.currentrow = function () {
    var row = this.row;
    return row;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 404;
    this.row = 5;
    this.col = 2;
    this.xstart = this.x;
    this.ystart = this.y;
    this.rowstart = this.row;
}

//check the direction input and move player
//keep player on board
//tiles are 101x83
Player.prototype.update = function (dt) {
    switch (this.dir) {
    case "left":
        if (this.x > 0) {
            this.x = this.x - 101;
            this.col--;
        }
        logPlayerLocation(this.x, this.y, this.row, this.col);
        break;
    case "right":
        if (this.x < ctx.canvas.width - 200) {
            this.x = this.x + 101;
            this.col++;
        }
        logPlayerLocation(this.x, this.y, this.row, this.col);
        break;
    case "up":
        if (this.y > 10) {
            this.y = this.y - 83;
            this.row--;
        }
        logPlayerLocation(this.x, this.y, this.row, this.col);
        break;
    case "down":
        if (this.y < 404) {
            this.y = this.y + 83;
            this.row++;
        }
        logPlayerLocation(this.x, this.y, this.row, this.col);
        break;
    default:
        break;
    }
    this.collision();
    this.dir = "";
}

//log location of player as it moves on canvas for debugging
function logPlayerLocation(x, y, row, col) {
    console.log("x=" + x + ", y=" + y + " ,row=" + row + ", col=" + col);
}

//check for collision
//get the left/right/row of each enemy and compare with the left/right/row of the player
//if collision detected reset player location
Player.prototype.collision = function () {
    //check for enemy collision
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].right() > this.left() && allEnemies[i].left() < this.right() && allEnemies[i].currentrow() == this.row) {
            //collision detected
            //console.log("collision");
            this.y = this.ystart;
            this.row = this.rowstart;
        }
    }
    //check for gem collision
    if (this.row == 0 && gem.col == this.col) {
        //got gem, increase score, move back to start
        console.log("got gem");
        this.y = this.ystart;
        this.row = this.rowstart;
        gem.reset();
    }
}

// return the left edge of the player object (for collision detection)
Player.prototype.left = function () {
    var left = this.x;
    return left;
}

// return the right edge of the player object (for collision detection)
Player.prototype.right = function () {
    var right = this.x + 70;
    return right;
}

// Draw the player on the screen
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// set direction from keys on event listener
Player.prototype.handleInput = function (dir) {
    this.dir = dir;
}

//gem object
var Gem = function () {
    this.sprite = 'images/GemGreen.png';
    this.col = Math.floor((Math.random() * 4) + 0);
    this.x = (this.col * 101) + 25;
    this.y = 35;
}

Gem.prototype.update = function () {}

Gem.prototype.reset = function () {
    this.col = Math.floor((Math.random() * 4) + 0);
    this.x = (this.col * 101) + 25;
}

// Draw the gem on the screen
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 80);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
createEnemies(3);

var player = new Player();

var gem = new Gem();
console.log(gem);

function createEnemies(count) {
    var rowMax = 3;
    var maxSpeed = 200;
    var minSpeed = 50;
    var rowStart = 60;
    var rowHeight = 83;
    var x = -100,
        y = 0,
        row = 1;
    for (var i = 0; i < count; i++) {
        //add one enemy for each row then set random row for each one after
        if (row > rowMax) {
            row = Math.floor((Math.random() * rowMax) + 1);
        }
        y = rowStart + ((row - 1) * rowHeight);
        //set random speed between minSpeed and maxSpeed
        var speed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
        allEnemies.push(new Enemy(x, y, speed, row));
        row++;
    }
    console.log(allEnemies);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});