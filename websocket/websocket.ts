import WebSocket, { WebSocketServer } from 'ws';
import { Player, Track } from 'lavalink-client'
import { SongInfoExport } from '../classes/SongInfoExport'

// WebSocket Server
const websocket_server = new WebSocketServer({
    port: 8181,
})

// Sending track info via websocket
export default function track_websocket(client){
    websocket_server.on('connection', async (ws) => {
        client.lavalink.nodeManager.nodes.map(result => {
                client.lavalink.on('trackStart', async function send_data(player: Player , track: Track ){
                    console.log("Track started!")
                    client.lavalink.removeListener('trackStart', send_data)
                    let songinfo = new SongInfoExport(player.guildId, track, client).json
                    ws.send(songinfo)
                })
        })
        
    })
    
}


