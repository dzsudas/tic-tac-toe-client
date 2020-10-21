import Api from "./Api";

const POLL_TIMEOUT = 1000;

class Observable {
    listeners: Function[] = [];

    addListener(fn: Function) {
        this.listeners = [fn, ...this.listeners];
    }

    removeListener(fn: Function) {
        this.listeners = this.listeners.filter((listener) => listener !== fn);
    }

    trigger() {
        this.listeners.forEach(fn => fn(this));
    }
}

export class GameClient extends Observable {
    private gameId;
    private game: any;
    private team: "X" | "O" | null = null;
    private playerId: string | null = null;

    constructor(gameId) {
        super();
        this.gameId = gameId;

        Api.getGame(this.gameId).then(this.updateGame).then(this.poll)
    }

    updateGame = (game) => {
        this.game = game;
        this.trigger();
    }

    poll = () => {
        setTimeout(() => {
            this.loadGameState()
                .then(this.poll)
        }, POLL_TIMEOUT);
    }

    loadGameState = () => Api.getGame(this.gameId)
        .then(this.updateGame)

    join = (team: 'X' | 'O') => {
        Api.join(this.gameId, team).then(playerId => {
            if (playerId) {
                this.team = team;
                this.playerId = playerId;
            }
        }).then(this.loadGameState);
    }

    move = (X, Y) => {
        if (this.game?.isGameReady && this.playerId) {
            Api.move(this.gameId, this.playerId, X, Y).then(this.loadGameState)
        }
    }

    serialize() {
        return {
            ...(this.game || {}),
            team: this.team,
            join: this.join,
            move: this.move
        }
    }
}

export const game = new URLSearchParams(window.location.search).has('gameId') ?
    new GameClient(new URLSearchParams(window.location.search).get('gameId'))
    :
    null;
