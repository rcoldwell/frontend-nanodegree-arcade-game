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

// enemy's left for collision check
Enemy.prototype.left = function () {
    var left = this.x + 30;
    return left;
}

// enemy's right for collision check
Enemy.prototype.right = function () {
    var right = this.x + 70;
    return right;
}

// enemy's row for collision check
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
var Player = function (x, y, row) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.row = row;
    this.xstart = x;
    this.ystart = y;
    this.rowstart = row;
}

Player.prototype.update = function (dt) {
    switch (this.dir) {
    case "left":
        if (this.x > 0) {
            this.x = this.x - 101;
        }
        console.log(this.x + "," + this.y + "," + this.row);
        break;
    case "right":
        if (this.x < ctx.canvas.width - 200) {
            this.x = this.x + 101;
        }
        console.log(this.x + "," + this.y + "," + this.row);
        break;
    case "up":
        if (this.y > 10) {
            this.y = this.y - 83;
            this.row--;
        }
        console.log(this.x + "," + this.y + "," + this.row);
        break;
    case "down":
        if (this.y < 404) {
            this.y = this.y + 83;
            this.row++;
        }
        console.log(this.x + "," + this.y + "," + this.row);
        break;
    default:
        this.x = this.x;
        this.y = this.y;
        break;
    }
    this.collision();
    this.dir = "";
}

Player.prototype.collision = function () {
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].right() > this.left() && allEnemies[i].left() < this.right() && allEnemies[i].currentrow() == this.row) {
            //collision detected
            //console.log("collision");
            this.y = this.ystart;
            this.row = this.rowstart;
        }
    }
}

// player's left value for collision check
Player.prototype.left = function () {
    var left = this.x;
    return left;
}

// player's right value for collision check
Player.prototype.right = function () {
    var right = this.x + 70;
    return right;
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function (dir) {
    this.dir = dir;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var maxspeed = 200;
var minspeed = 50;
var rowstart = 60;
var rowheight = 83;
for (i = 0; i < 3; i++) {
    var x = 0;
    var y = rowstart + (i * rowheight);
    var speed = Math.floor(Math.random() * (maxspeed - minspeed)) + minspeed;
    allEnemies.push(new Enemy(x, y, speed, i + 1));
}
console.log(allEnemies);

var player = new Player(202, 404, 5);


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