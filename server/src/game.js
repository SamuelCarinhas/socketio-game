export default class Game {

    constructor(width, height, playerSize) {
        this.width = width;
        this.height = height;
        this.playerSize = playerSize;
        this.players = {};
        this.observers = [];
    }

    subscribe(observerFunction) {
        this.observers.push(observerFunction);
    }

    notifyAll(command) {
        for(let observerFunction of this.observers)
            observerFunction(command)
    }

    getRemainingPlayers(playerName) {
        let result = [];
        Object.keys(this.players).map((player) => {
            if(this.players[player].playerName !== playerName)
                result.push(this.players[player]);
            return this.player;
        });
        return result;
    }

    addPlayer(playerName) { 
        const x = playerName in this.players ? this.players[playerName].x : 0;
        const y = playerName in this.players ? this.players[playerName].y : 0;

        this.players[playerName] = {
            playerName: playerName,
            x: x,
            y: y
        }

        this.notifyAll({
            type: 'addPlayer',
            args: {
                playerName: playerName,
                x: x,
                y: y
            }
        });
    }

    disconnectPlayer(playerName) {
        delete this.players[playerName];

        this.notifyAll({
            type: 'disconnectPlayer',
            args: playerName
        });
    }

    getPlayer(playerName) {
        return playerName in this.players ? this.players[playerName] : {x: 0, y: 0};
    }

    updatePlayer(playerName, x, y) {
        if(!(playerName in this.players)) return;
        this.players[playerName].x = x;
        this.players[playerName].y = y;

        this.notifyAll({
            type: 'updatePlayer',
            args: {
                playerName: playerName,
                x: x,
                y: y
            }
        })
    }

}
