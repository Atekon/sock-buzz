import { IncomingMessage } from 'http';
import * as WebSocket from 'ws';
import { IPlayer } from './IPlayer';

interface IPlayerResult {
    player: IPlayer;
    time: Date;
}

interface ICallbacks {
    start();
    stop();
}

class GameHostSocketServer {
    private _socketServer: WebSocket.Server;
    private _clientSocket: WebSocket;

    constructor(private _callbacks: ICallbacks) {}

    public startServer(port: number) {
        if (this._socketServer) {
            return;
        }

        this._socketServer = new WebSocket.Server({ port });
        this._socketServer.on('connection', (ws, req) => this._onConnect(ws));
    }

    public sendPlayerPushOrder(player: IPlayerResult) {
        this._clientSocket.send(JSON.stringify(player));
    }

    private _onConnect(ws: WebSocket) {
        this._clientSocket = ws;
        ws.on('message', (data) => this._onMessage(data));
    }

    private _onMessage(data: WebSocket.Data) {
        switch (data) {
            case 'start':
            case 'stop':
                this._callbacks[data]();
                break;
        }
    }
}

export {
    GameHostSocketServer,
};
