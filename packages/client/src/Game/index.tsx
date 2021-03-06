import * as React from 'react';

import { Buzzer } from '../components/Buzzer';

import { getWebSocket } from '../helpers/WebSocketPromise';

const PLAYER_WEBSOCKET_PATH = `ws://${location.hostname}:9191`;

interface IGameProps {
    username: string;
}

interface IGameState {
    isBuzzActive: boolean;
}

class Game extends React.Component<IGameProps, IGameState> {
    private _socketConnection: WebSocket;

    constructor(props) {
        super(props);

        this.state = {
            isBuzzActive: false,
        };
    }

    public start() {
        this.setState({
            isBuzzActive: true,
        });
    }

    public stop() {
        this.setState({
            isBuzzActive: false,
        });
    }

    public sendBuzz() {
        this._socketConnection.send(JSON.stringify({ type: 'BUZZ' }));
    }

    public sendName() {
        this._socketConnection.send(JSON.stringify({ name: this.props.username, type: 'NAME' }));
    }

    public connect() {
        return getWebSocket(PLAYER_WEBSOCKET_PATH)
            .then((ws) => {
                this._socketConnection = ws;
                this.sendName();

                ws.addEventListener('message', (message) => this._onMessage(message));
            });
    }

    public componentDidMount() {
        return this.connect();
    }

    public componentWillUnmount() {
        this._socketConnection.close();
    }

    public render() {
        const style: React.CSSProperties = {
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
        };

        return <div style={style}>
            <Buzzer
                active={ this.state.isBuzzActive }
                onBuzz={ () => { this.sendBuzz(); } }
            />
        </div>;

    }

    private _onMessage(message: MessageEvent) {
        const parsedData = JSON.parse(message.data);

        switch (parsedData.type) {
            case 'start':
                this.start();
                break;
            case 'stop':
                this.stop();
                break;
        }
    }
}

export {
    Game,
};
