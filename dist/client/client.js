import io from "socket.io-client";
export class Client {
    socket;
    movements;
    constructor() {
        this.socket = io();
        this.movements = [];
        this.socket.on("other_players_moves", (data) => {
            this.movements.push(data);
        });
    }
    move(direction) {
        this.socket.emit("move_player", {
            movement: direction,
        });
    }
}
//# sourceMappingURL=client.js.map