import { Events, ActivityType, GatewayIntentBits, PresenceUpdateStatus } from 'discord.js';
import { GuildShardPayload, LavalinkManager } from "lavalink-client";
import { modules, interaction_handler } from './handlers/command_handler';
import { dbfind, upsort } from './util/mongodb_wrapper'
import { calculatedLevel } from './interfaces/calculatedLevel';


require('dotenv').config()
const mongodb_uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWD}@cluster0.9ph1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
import discordClient from './classes/DiscordClient';
import count_xp from './xp/xp_handler'
import track_websocket from './websocket/websocket';
import config from './config.json';



// Discord.js client (discordClient is a extension of Client)
export const client = new discordClient({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
], uri: mongodb_uri}) as discordClient

client.lavalink = new LavalinkManager({
    nodes: [{
        id: "Node",
        host: "localhost",
        port: 8090,
        authorization: "lavalinkv4",
        retryAmount: 5,
    }],
    sendToShard: (guildId: string, payload: GuildShardPayload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: config.clientid,
        username: "Furina",
    },
})

// Event for new users
client.on(Events.GuildMemberAdd, async (member) => {
    let proj = {}
    proj['_id'] = 0
    proj[member.id] = 1
    let result = await dbfind('exp', client.mongodb, { guildid: member.guild.id }, { projection: proj })

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
    client.lavalink.init({
        id: cl.user.id,
        username: cl.user.username
    });
    // Client  presence
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