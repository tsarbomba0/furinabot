import config from './config.json';
import { Client, Events, ActivityType, GatewayIntentBits, PresenceUpdateStatus } from 'discord.js';
import { GuildShardPayload, LavalinkManager } from "lavalink-client";
import { modules, interaction_handler } from './handlers/command_handler';
import track_websocket from './websocket/websocket';
require('dotenv').config()


// Client
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
]}) as any

// Manager
client.lavalink = new LavalinkManager({
    nodes: [{
        id: "node_1",
        host: "localhost",
        port: 2333,
        authorization: "youshallnotpass",
    }],
    sendToShard: (guildId: string, payload: GuildShardPayload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: config.clientid,
        username: "Furina",
    },
});

// Event: Handling raw WebSocket events
client.on("raw", (data: any) => {
    client.lavalink.sendRawData(data); // Passing raw data to lavalink-client   for handling
});

// Once ready
client.once(Events.ClientReady, (cl: any) => {
    client.lavalink.init(client.user);
    // Client presence
    client.user.setPresence({ activities: [{ name: "Ei & Yae Miko in bedsheets", type: ActivityType.Watching }], status: PresenceUpdateStatus.Online })
    console.log("(discord) Focalors onlyfans service is up")
})

// functions from imports
track_websocket(client);
modules(client);
interaction_handler(client);

// Login
client.login(`${process.env.TOKEN}`)