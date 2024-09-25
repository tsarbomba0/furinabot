const config = require('./config.json')
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, EmbedBuilder } = require('discord.js');
const prefix="&"
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]})

client.once(Events.ClientReady, cl => {
    console.log("Focalors onlyfans service is up")
})

client.on("messageCreate", (msg) =>{
    var content = msg.content
    var author = msg.author.globalName
    if (msg.content.startsWith(prefix)){
        commandargs = content.slice(1).split(" ") // "first argument" is command name
        if (!commandargs[0]){
            console.log("Empty prefix.")
        } else {
            if (commandargs[0] == "furina"){
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
                func();
            
        }
        

    }
}})

client.login(`${config.clientid}`)