import config from './config.json';
import { Client, Events, ActivityType, GatewayIntentBits, Collection, PresenceUpdateStatus } from 'discord.js';
import fs from 'node:fs';
import { GuildShardPayload, LavalinkManager, Track } from "lavalink-client";
import express from 'express';
import { SongInfoExport } from './classes/SongInfoExport'; 

const folderpath = './modules'
const cmdfolder = fs.readdirSync('./modules')
const port = 8989;

// Client
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
]}) as any



// Express.js
client.express = express()

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
        username: "furina",
    },
});

// Event: Handling raw WebSocket events
client.on("raw", (data: any) => {
    client.lavalink.sendRawData(data); // Passing raw data to lavalink-client   for handling
});

// Modules for slash commands
client.commands = new Collection();
for (let folder in cmdfolder){
    console.log(`${cmdfolder[folder]} - Discord`)
    const command = require(`${folderpath}/${cmdfolder[folder]}`)
    client.commands.set(command.data.name, command);
}

// Slash commands
client.on(Events.InteractionCreate, async (interaction: { isChatInputCommand: () => boolean; client: { commands: { get: (arg0: string) => any; }; }; commandName: string; }) => {
    if (!interaction.isChatInputCommand()){return};
    let command = interaction.client.commands.get(interaction.commandName);
    if (!command){
        console.log(`Did not find: ${interaction.commandName} !`)
    }
    await command.execute(interaction, client)
});

// Once ready
client.once(Events.ClientReady, (cl: any) => {
    client.lavalink.init(client.user);
    // Client presence
    client.user.setPresence({ activities: [{ name: "Ei & Yae Miko in bedsheets", type: ActivityType.Watching }], status: PresenceUpdateStatus.Online })
    console.log("(discord) Focalors onlyfans service is up")
})

// Sending information about currently playing song
client.lavalink.on("trackStart", (player: { guildId: string; }, track: Track, payload: GuildShardPayload) => {
    let songinfo = new SongInfoExport(player.guildId, track, client).json
    // send SongInfo to Express (as JSON)
    client.express.get('/musicinfo', (req: any, res: any) =>{
        res.setHeader('Content-Type', 'application/json');
        res.send(songinfo)
    })
})

// Express listening
client.express.listen(port, () => {
    console.log(`(expressjs) Listening on port ${port}`)
})

client.login(`${config.token}`)