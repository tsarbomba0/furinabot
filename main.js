const config = require('./config.json')
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, EmbedBuilder, } = require('discord.js');
const fs = require('node:fs')
const { LavalinkManager } = require("lavalink-client");
const express = require('express');
const port = 8989;
const SongInfoExport = require('./classes/SongInfoExport.js')

// Client
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
]})

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
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: config.clientid,
        username: "furina",
    },
});

// Event: When a node is successfully created and connected
client.lavalink.on("nodeCreate", node => {
    console.log(`${node.host} was connected`);
});

// Event: Handling raw WebSocket events
client.on("raw", data => {
    client.lavalink.sendRawData(data); // Passing raw data to lavalink-client   for handling
});



// Modules for slash commands
client.commands = new Collection();
const folderpath = './modules'
const cmdfolder = fs.readdirSync('./modules')
for (folder in cmdfolder){
    console.log(`${cmdfolder[folder]} - Discord`)
    const command = require(`${folderpath}/${cmdfolder[folder]}`)
    client.commands.set(command.data.name, command);
}


// Slash commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()){return};
    var command = interaction.client.commands.get(interaction.commandName);
    if (!command){
        console.log(`Did not find: ${interaction.commandName} !`)
    }
    await command.execute(interaction, client)
});

// Once ready
client.once(Events.ClientReady, cl => {
    client.lavalink.init(client.user);
    console.log("Focalors onlyfans service is up")
})

// Events for lavalink
client.lavalink.on("trackStart", (player, track, payload) => {
    songinfo = new SongInfoExport(player.guildId, track, false, client).json
    // send SongInfo to Express (as JSON)
    client.express.get('/musicinfo', (req, res) =>{
        res.setHeader('Content-Type', 'application/json');
        res.send(songinfo)
    })
})

// Express listening
client.express.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


client.login(`${config.token}`)