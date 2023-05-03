import http from "http";
import * as socketIO from "socket.io";
import express, { Express, Response, Request } from "express";
import path from 'path';

namespace GameServer {
  export class App {
    private server: http.Server;
    private port: number;
    private players: socketIO.Socket[];
    private io: socketIO.Server;

    public constructor(port: number) {
      this.port = port;
      this.players = [];

      const app: Express = express();

      app.use(express.static(path.join(__dirname, '../client')));

      app.get("/", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../views/index.html'));
      });

      this.server = new http.Server(app);
      this.io = new socketIO.Server(this.server);

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

    public start() {
      console.log("starting app");

      this.server.listen(this.port);

      console.log(`Server listening on port ${this.port}.`);
    }
  }
}

let app = new GameServer.App(3000);
app.start();
