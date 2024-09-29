const config = require('./config.json')
const ytdl = require("@distube/ytdl-core")
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, EmbedBuilder, } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection,  AudioPlayerStatus } = require("@discordjs/voice")
const prefix="&"


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



const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
]})



client.once(Events.ClientReady, cl => {
    console.log("Focalors onlyfans service is up")
})

client.on("messageCreate", (msg) =>{
    var content = msg.content
    var author = msg.author.globalName
    var a = 0

    if (msg.content.startsWith(prefix)){
        commandargs = content.slice(1).split(" ") // "first argument" is command name
        if (!commandargs[0]){
            console.log("Empty prefix.")
        } else {
            if (commandargs[0] == "ruehaxo26may"){
                var unholy_link = "https://rule34.xxx/index.php?page=post&s=list&tags=furina_%28genshin_impact%29+yuri+-ai_generated+-smelly+-video+-fart+-bloated"
                var func = async () => {
                    var resp = await fetch(unholy_link);
                    var resptext = await resp.text();
                    var textarray = resptext.split("\n");
                    var outputs = []
                    var link_array = []
                    var pidnum = 42

                    for (i in textarray){
                        if(textarray[i].includes("<img src=")){
                            if(textarray[i].includes('wimg')){
                                outputs.push(textarray[i].match(/(src=".+")/)[1].split(" ")[0].replace("src=\"","")) 
                            }
                        } else if (textarray[i].includes("<a href=\"?page=post&amp;s=list&amp;tags=furina_%28genshin_impact%29+yuri+-ai_generated+-smelly+-video+-fart+-bloated&amp;")){
                            var count = (textarray[i].match(/is/g) || []).length;
                        }
                        
                    }
                    count = count/2
                    i=0
                    while (i != count+1){
                        link_array.push(`${unholy_link}&pid=${i*pidnum}`)
                        i++;
                    }
                    link_array.shift()
                    for (a in link_array){
                        var resp = await fetch(link_array[a]);
                        var resptext = await resp.text();
                        var textarray = resptext.split("\n");
                        for (i in textarray){
                            if(textarray[i].includes("<img src=")){
                                if(textarray[i].includes('wimg')){
                                    outputs.push(textarray[i].match(/(src=".+")/)[1].split(" ")[0].replace("src=\"","")) 
                                }}
                    }}
                    
                    chosenimage = outputs[Math.floor(Math.random() * outputs.length)]
                    const Embed = new EmbedBuilder()
                    .setColor("#000000")
                    .setFooter({ text: "i have no more pasta"})
                    .setTimestamp()
                    .setTitle(`${author}! You asked for this.`)
                    .setImage(`${chosenimage}`)

                    msg.channel.send({ embeds: [Embed]})
                };
                try {func()} catch (err) {console.log(err)}
            
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

client.login(`${config.clientid}`)