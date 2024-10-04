const config = require('./config.json')
//const ytdl = require("@distube/ytdl-core")
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, EmbedBuilder, } = require('discord.js');
//const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection,  AudioPlayerStatus } = require("@discordjs/voice")
const fs = require('node:fs')
const { LavalinkManager } = require("lavalink-client");

//const nodes = require('./lavalink/nodes.json')
// Client
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
]})

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



client.login(`${config.token}`)