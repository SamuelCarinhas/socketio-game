export default class Game {

    constructor(width, height, playerSize) {
        this.width = width;
        this.height = height;
        this.playerSize = playerSize;
        this.players = {
            'ColdAtom': {
                x: 0,
                y: 0
            }
        };
    }

    getPlayer(playerName) {
        return this.players[playerName];
    }

    updatePlayer(playerName, x, y) {
        this.players[playerName].x = x;
        this.players[playerName].y = y;

        return this;
    }

}