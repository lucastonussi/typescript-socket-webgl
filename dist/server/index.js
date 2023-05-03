import http from "http";
import * as socketIO from "socket.io";
import express from "express";
import root from "app-root-path";
var GameServer;
(function (GameServer) {
    class SocketPlug {
        io;
        server;
        players;
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
        port;
        server;
        socketPlug;
        constructor(port) {
            this.port = port;
            const app = express();
            app.use(express.static(`${root.path}/dist`));
            this.server = new http.Server(app);
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