"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const tslib_1 = require("tslib");
const socket_io_client_1 = tslib_1.__importDefault(require("socket.io-client"));
class Client {
    constructor() {
        this.socket = (0, socket_io_client_1.default)();
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
exports.Client = Client;
//# sourceMappingURL=client.js.map