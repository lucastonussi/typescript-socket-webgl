"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = tslib_1.__importDefault(require("http"));
const socketIO = tslib_1.__importStar(require("socket.io"));
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
var GameServer;
(function (GameServer) {
    class App {
        constructor(port) {
            this.port = port;
            this.players = [];
            const app = (0, express_1.default)();
            app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
            app.get("/", (req, res) => {
                res.sendFile(path_1.default.join(__dirname, '../../views/index.html'));
            });
            this.server = new http_1.default.Server(app);
            this.io = new socketIO.Server(this.server);
            this.io.sockets.on("connection", (socket) => {
                console.log(`a user connection ${socket.id}`);
                this.players.push(socket);
                socket.on("move_player", (data) => {
                    console.log(`the player ${socket.id} moved: ${data.movement}`);
                    for (const player of this.players) {
                        if (player == socket) {
                            continue;
                        }
                        console.log(`telling the player ${player.id} that ${socket.id} moved to ${data.movement}!`);
                        player.emit("other_players_moves", {
                            msg: `the player ${socket.id} moved: ${data.movement}`,
                        });
                    }
                });
                socket.on("disconnect", () => {
                    this.players.splice(this.players.indexOf(socket));
                    console.log(`there are ${this.players.length} now...`);
                    console.log(`a user disconnected ${socket.id}`);
                });
            });
        }
        start() {
            console.log("starting app");
            this.server.listen(this.port);
            console.log(`Server listening on port ${this.port}.`);
        }
    }
    GameServer.App = App;
})(GameServer || (GameServer = {}));
let app = new GameServer.App(3000);
app.start();
//# sourceMappingURL=index.js.map