import React from 'react';
import './App.css';
import Button from "react-bootstrap/Button";
import {game} from "./Game";
import Api from "./Api";
import WithGameState from "./WithGameState";

const MoveStatus = () =>
    <WithGameState render={(data) => !!data.state && data.isGameReady && !data.isGameFinished &&
        <div> {data.team === data.activeTeam ? 'Your Move' : `Team ${data.activeTeam} move`} </div>
    }/>

const WinStatus = () =>
    <WithGameState render={(data) => !!data.state && data.isGameReady && data.isGameFinished &&
        <div>
            {!data.winner ? 'Draw' :
                data.team ?
                    data.team === data.winner ?
                        'You Won' :
                        `You Lost` :
                    `Team ${data.winner} won`
            }
        </div>
    }/>

const StartAGame = ({label = 'Start'}) =>
    <Button size="lg" onClick={() => Api.createGame().then(gameId => window.location.search = `?gameId=${gameId}`)}>
        {label}
    </Button>

const StartAgain = () =>
    <WithGameState render={(data) => !!data.state && data.isGameFinished && data.team &&
        <StartAGame label="Start Again" />
    }/>

const ConnectionStatus = () =>
    <WithGameState render={(data) => !!data.state && !data.isGameReady && data.team &&
        <div>Waiting for another player to join</div>
    }/>

const GameField = () =>
    <WithGameState render={(data) => !!data.state &&
        <div className="w-25 m-auto">
            <div className="tic-tac-field-grid">
                {data.state.map( (state, X) => state.map((value, Y) =>
                    <Button key={`${X}_${Y}`} className='tic-tac-field-button m-auto' variant="secondary" onClick={() => data.move(X, Y)}>
                        {value ? value : ''}
                    </Button>
                ) )}
            </div>
        </div>
    }/>

const JoinXTeamButton = () =>
    <WithGameState render={(data) => !!data.state && !data.isTeamXReady && !data.team ?
        <Button onClick={() => data.join('X')}>Join X Team</Button> : <div/>
    }/>

const JoinOTeamButton = () =>
    <WithGameState render={(data) => !!data.state && !data.isTeamOReady && !data.team &&
        <Button onClick={() => data.join('O')}>Join O Team</Button>
    }/>

export default () =>
    <div className="container p-3">
        {!game ?
            <div className="d-flex justify-content-center p-4">
                <StartAGame />
            </div>
            :
            <div>
                <div>
                    <ConnectionStatus />
                    <MoveStatus/>
                    <WinStatus/>
                </div>
                <div className="d-flex justify-content-between">
                    <JoinXTeamButton/>
                    <JoinOTeamButton/>
                </div>

                <GameField />

                <div className="p-3 d-flex justify-content-center">
                    <StartAgain />
                </div>
            </div>
        }
    </div>
