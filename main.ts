import config from './config.json';
import { Client, Events, ActivityType, GatewayIntentBits, PresenceUpdateStatus } from 'discord.js';
import { GuildShardPayload, LavalinkManager } from "lavalink-client";
import { modules, interaction_handler } from './handlers/command_handler';
import track_websocket from './websocket/websocket';
require('dotenv').config()
import { MongoClient } from "mongodb"
import { dbfind, upsort } from './util/mongodb_wrapper'
import count_xp from './xp/xp_handler'
import { calculatedLevel } from './interfaces/calculatedLevel';



// Discord.js client
export const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
]}) as any

// MongoDB uri and client
const mongodb_uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWD}@cluster0.9ph1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
client.mongodb = new MongoClient(mongodb_uri);

// Lavalink Manager
client.lavalink = new LavalinkManager({
    nodes: [{
        id: "node_1",
        host: "node.lewdhutao.my.eu.org",
        port: 80,
        authorization: "youshallnotpass",
    }],
    sendToShard: (guildId: string, payload: GuildShardPayload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: config.clientid,
        username: "furina",
    },
});

// Event for new users
client.on(Events.GuildMemberAdd, async (member) => {
    let proj = {}
    proj['_id'] = 0
    proj[member.id] = 1
    let result = await dbfind('exp', client.mongodb, { guildid: member.guildId }, { projection: proj })

    let data: calculatedLevel
    if(Object.keys(result).length === 0){
        data[member.id] = {
            xp: 0,
            level: 0
        }
        upsort('exp', client.mongodb, { guildid: member.guild.id }, data)
    }
})
// Event for handling raw WebSocket events
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
count_xp(client)

// Login
client.login(`${process.env.TOKEN}`)