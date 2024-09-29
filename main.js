const config = require('./config.json')
const ytdl = require("@distube/ytdl-core")
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, EmbedBuilder, } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection,  AudioPlayerStatus } = require("@discordjs/voice")
const fs = require('node:fs')
const prefix="&"



// Client
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
]})


// Modules for slash commands
client.commands = new Collection();
const folderpath = './modules'
const cmdfolder = fs.readdirSync('./modules')

for (folder in cmdfolder){
    console.log(`${cmdfolder[folder]} - Discord`)
    const command = require(`${folderpath}/${cmdfolder[folder]}`)
    client.commands.set(command.data.name, command);
}


// Repeat
repeat_boolean = false;
let repeated_track;

// Query
var query_count = 0;
var query = [];
let video;
let saved_query;

// Player
let pauseboolean = false;
const player = createAudioPlayer();
player.on(AudioPlayerStatus.Idle, () => {
    console.log("Idle!")
    query_count += 1;
    if (query_count < query.length){
        console.log(query_count)
        video = ytdl(query[query_count], { filter: "audioonly"})
        audio = createAudioResource(video)
        player.play(audio)
        
    } else {
        console.log("End of query!")
        console.log(query_count)
        query_count = 0;
        if (repeat_boolean=true){
            console.log(query[query_count])
            try {
                video = ytdl(query[query_count], { filter: "audioonly"})
                audio = createAudioResource(video)
                query_count += 1;
                player.play(audio)
            } catch (err) {
                console.log("Gah!")
            }
        } else {
            query = []
        }
    }
});






client.once(Events.ClientReady, cl => {
    console.log("Focalors onlyfans service is up")
})

/*
            
        } else if(commandargs[0] == "play"){

            if(!client.voice.channel){
                const connection = joinVoiceChannel({
                    channelId: msg.member.voice.channel.id,
                    guildId: msg.channel.guild.id,
                    adapterCreator: msg.channel.guild.voiceAdapterCreator,
                }).subscribe(player)
            }

            if(!commandargs[1].includes("https://")){ console.log("Not a valid link!")} else {
                if(repeat_boolean == false){
                    query.push(commandargs[1])
                } else {
                    saved_query.push(commandargs[1])
                }
                console.log(query)
            }
            
            if (query_count == 0){
                const video = ytdl(query[query_count], { filter: "audioonly"})
                player.play(createAudioResource(video))
                
            }
            
            } else if(commandargs[0] == "stop"){
                if(!player){console.log("No player!")} else {
                    player.stop(); 
                }
            } else if(commandargs[0] == "disconnect"){
                    try {
                        getVoiceConnection(msg.member.guild.id).destroy();
                    } catch (err){ 
                        console.log(err)
                    }
            } else if(commandargs[0] == "pause"){
                if(pauseboolean == false){
                    if(!player){console.log("No player!")} else {
                        player.pause(); 
                    }
                } else if(pauseboolean == true){
                    if(!player){console.log("No player!")} else {
                        player.unpause(); 
                    } 
                } else {
                    console.log("What? pause section.")
                }
                
            } else if(commandargs[0] == "repeat"){
                if (repeat_boolean == true){
                    repeat_boolean = false
                    if(repeated_track == undefined){
                        true
                    } else {
                        query = saved_query
                    }
                } else {
                    if(commandargs[1] == "track"){

                        repeated_track = query[query_count]
                        console.log(repeated_track)

                        saved_query = query
                        query = [repeated_track]

                        repeat_boolean = true

                    } else if (commandargs[1] == "playlist"){
                        repeat_boolean = true
                    }
                }
                
            }
            
        }
        

    }
})
*/

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()){return};
    var command = interaction.client.commands.get(interaction.commandName);
    if (!command){
        console.log(`Did not find: ${interaction.commandName} !`)
    }
    await command.execute(interaction)
});

client.login(`${config.token}`)