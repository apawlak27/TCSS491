var messages = [];
var ASSET_MANAGER = new AssetManager();
var gameboard = new GameBoard();

var socket = io.connect("http://76.28.150.193:8888");

socket.on("load", function (data) {
    console.log(data);
});


window.onload = function () {
    console.log("starting up da sheild");
    var field = document.getElementById("field");
    var ctx = document.getElementById("gameworld").getContext("2d");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var username = name.innerHTML;

    var gameEngine = new GameEngine();

    socket.on('start', function (data) {
        socket.username = username;
        socket.emit('init', username);
    });

    socket.on("sync", function (data) {
        gameEngine.gameboard.board = data.board;
        gameEngine.gameboard.black = data.black;
    });

    socket.on('click', function (data) {
        gameEngine.gameboard.move(data.click.x, data.click.y);
    });

    socket.on("message", function (data) {
        if (data.message) {
            messages.push(data);
            var html = '';
            for (var i = 0; i < messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : "Server") + ": </b>";
                html += messages[i].message + "<br />";
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }

    });

    field.onkeydown = function (e) {
        if (e.keyCode === 13) {
            var text = field.value;
            socket.emit("send", { message: text, username: name });
            field.value = "";
        }
    };

    socket.on("connect", function () {
        console.log("Socket connected.")
    });
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });

    ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
    ASSET_MANAGER.queueDownload("./img/black.png");
    ASSET_MANAGER.queueDownload("./img/white.png");

    ASSET_MANAGER.downloadAll(function () {
        gameEngine.init(ctx, gameboard);
        gameEngine.start();
    });

}

