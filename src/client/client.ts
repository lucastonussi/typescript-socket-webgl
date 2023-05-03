import io, { Socket } from "socket.io-client";

export class Client {
  private socket: Socket;
  private movements: Object[];

  constructor() {
    this.socket = io();
    this.movements = [];

    this.socket.on("other_players_moves", (data) => {
      this.movements.push(data);
    });
  }

  public move(direction: string) {
    this.socket.emit("move_player", {
      movement: direction,
    });
  }
}
