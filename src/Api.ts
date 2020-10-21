const REACT_APP_GAME_HOST = process.env.REACT_APP_GAME_HOST || 'http://localhost:8888';

const post = (url, data = {}) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(resp => resp.status >= 200 && resp.status < 400 ? resp.text() : Promise.reject());

const getJson = (url) =>
    fetch(url).then(resp => resp.status === 200 ? resp.json() : Promise.reject());

export default class {
    public static createGame() {
        return post(`${REACT_APP_GAME_HOST}/game/create`)
    }

    public static getGame(id) {
        return getJson(`${REACT_APP_GAME_HOST}/game/${id}`);
    }

    public static join(gameId, team: 'X' | 'O') {
        return post(`${REACT_APP_GAME_HOST}/game/join`, {
            gameId,
            team
        });
    }

    public static move(gameId, playerId, X, Y) {
        return post(`${REACT_APP_GAME_HOST}/game/move`, {
            gameId,
            playerId,
            X,
            Y,
        });
    }
}
