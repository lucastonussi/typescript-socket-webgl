"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = tslib_1.__importDefault(require("http"));
const socketIO = tslib_1.__importStar(require("socket.io"));
const express_1 = tslib_1.__importDefault(require("express"));
const app_root_path_1 = tslib_1.__importDefault(require("app-root-path"));
var GameServer;
(function (GameServer) {
    class SocketPlug {
        constructor(server) {
            this.server = server;
            this.players = [];
            this.io = new socketIO.Server(this.server);
        }
        perform() {
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
    }
    GameServer.SocketPlug = SocketPlug;
    class App {
        constructor(port) {
            this.port = port;
            const app = (0, express_1.default)();
            app.use(express_1.default.static(`${app_root_path_1.default.path}/dist`));
            this.server = new http_1.default.Server(app);
            this.socketPlug = new SocketPlug(this.server);
        }
        perform() {
            console.log("starting app");
            this.socketPlug.perform();
            this.server.listen(this.port);
            console.log(`Server listening on port ${this.port}.`);
        }
    }
    GameServer.App = App;
})(GameServer || (GameServer = {}));
let app = new GameServer.App(3000);
app.perform();
//# sourceMappingURL=index.js.map