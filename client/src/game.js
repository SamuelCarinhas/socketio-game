export default class Game {

    constructor(width, height, playerSize) {
        this.width = width;
        this.height = height;
        this.playerSize = playerSize;
        this.players = {};
    }

    copy() {
        return this;
    }

    removePlayer(playerName) {
        delete this.players[playerName];
    }

    addPlayer(player) {
        this.players[player.playerName] = player;
    }

    getPlayer(playerName) {
        return playerName in this.players ? this.players[playerName] : {x: 0, y: 0};
    }

    updatePlayer(playerName, x, y) {
        if(!(playerName in this.players)) return;
        this.players[playerName].x = x;
        this.players[playerName].y = y;
    }

}