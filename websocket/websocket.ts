import WebSocket, { WebSocketServer } from 'ws';
import { Player, Track } from 'lavalink-client'
import { SongInfoExport } from '../classes/SongInfoExport'

let event_already_exists = false;
// WebSocket
const websocket_server = new WebSocketServer({
    port: 8181,
})

// Sending track info and session id
export default function track_websocket(client){
    websocket_server.on('connection', async (ws) => {
        client.lavalink.nodeManager.nodes.map(result => {
                ws.send(JSON.stringify({
                    SessionID: result.sessionId
                }))
                if(event_already_exists===false){
                    client.lavalink.on('trackStart', async (player: Player , track: Track ) => {
                        console.log("Track started!")
                        let songinfo = new SongInfoExport(player.guildId, track, client).json
                        ws.send(songinfo)
                    })
                }
                event_already_exists = true;
        })
        
    })
    
}


