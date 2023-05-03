import http from "http";
import * as socketIO from "socket.io";
import express, { Express } from "express";
import root from "app-root-path";

namespace GameServer {
  export class SocketPlug {
    private io: socketIO.Server;
    private server: http.Server;
    private players: socketIO.Socket[];

    public constructor(server: http.Server) {
      this.server = server;

      this.players = [];

      this.io = new socketIO.Server(this.server);
    }

    public perform() {
      this.io.sockets.on("connection", (socket: socketIO.Socket) => {
        console.log(`a user connection ${socket.id}`);

        this.players.push(socket);

        socket.on("move_player", (data) => {
          console.log(`the player ${socket.id} moved: ${data.movement}`);

          for (const player of this.players) {
            if (player == socket) {
              continue;
            }

            console.log(
              `telling the player ${player.id} that ${socket.id} moved to ${data.movement}!`
            );

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

  export class App {
    private port: number;
    private server: http.Server;
    private socketPlug: SocketPlug;

    public constructor(port: number) {
      this.port = port;

      const app: Express = express();

      app.use(express.static(`${root.path}/dist`));

      this.server = new http.Server(app);
      this.socketPlug = new SocketPlug(this.server);
    }

    public perform() {
      console.log("starting app");

      this.socketPlug.perform();

      this.server.listen(this.port);

      console.log(`Server listening on port ${this.port}.`);
    }
  }
}

let app = new GameServer.App(3000);
app.perform();
