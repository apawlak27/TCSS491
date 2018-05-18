
// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.player = 1;
    this.radius = Math.random() * (40-5) + 5;
    this.mass = this.radius * 20;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.color = 3;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent != this && this.collide(ent)) {
            //var temp1 = { x: this.velocity.x, y: this.velocity.y };
            //var temp2 = {x: ent.velocity.x, y: ent.velocity.y};

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            var angle = Math.atan2(difY, difX);
            var p1 = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            var p2 = Math.sqrt(ent.velocity.x * ent.velocity.x + ent.velocity.y * ent.velocity.y);
            this.dir = Math.atan2(this.velocity.y, this.velocity.x);
            ent.dir = Math.atan2(ent.velocity.y, ent.velocity.x);
            var velX1 = p1 * Math.cos(this.dir - angle);
            var velY1 = p1 * Math.sin(this.dir - angle);
            var velX2 = p2 * Math.cos(ent.dir - angle);
            var velY2 = p2 * Math.sin(ent.dir - angle);
            var velocityX1 = ((this.mass - ent.mass) * velX1 + (ent.mass + ent.mass) * velX2) / (this.mass + ent.mass);
            var velocityX2 = ((this.mass + ent.mass) * velX1 + (ent.mass - this.mass) * velX2) / (this.mass + ent.mass);
            this.velocity.x = Math.cos(angle) * velocityX1 + Math.cos(angle + Math.PI / 2) * velY1;
            this.velocity.y = Math.sin(angle) * velocityX1 + Math.sin(angle + Math.PI / 2) * velY1;
            ent.velocity.x = Math.cos(angle) * velocityX2 + Math.cos(angle + Math.PI / 2) * velY2;
            ent.velocity.y = Math.sin(angle) * velocityX2 + Math.sin(angle + Math.PI / 2) * velY2;
        }

    }


    //this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    //this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

// the "main" code begins here
var friction = 1;
//var acceleration = 10000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    for (var i = 0; i < 11; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
});
