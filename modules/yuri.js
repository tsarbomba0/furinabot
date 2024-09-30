const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const config = require('../config.json')
const axios = require('axios');
const cheerio = require('cheerio')


var next_page_array=[]
var c = 0


// Ugh
const unholy_link = "https://rule34.xxx/index.php?page=post&s=list&tags=furina_%28genshin_impact%29+yuri+-ai_generated+-smelly+-video+-fart+-bloated"
module.exports = {
    data: new SlashCommandBuilder()
    .setName('yuri')
    .setDescription('Guess what!')
    .addStringOption(option => 
        option.setName('victim')
            .setDescription('Character name.')
    ),

    async execute(interaction){
        var author = interaction.user.globalName
        var page_array=[]
        var href_array=[]
        
        var $ = await cheerio.fromURL(unholy_link)
        $('img').each( (n, el) =>{
            if (!(el.attribs['data-cfsrc'].includes("images"))){
                href_array.push(el.attribs['data-cfsrc'])
                c++;
            }
        })
        $('.pagination').find('a').each( async (n, el) => {
            if(!el.attribs['alt']){
                page_array.push(el.attribs['href'])
            }
        })

        for (num in page_array){
            var ohe = await cheerio.fromURL('https://rule34.xxx/index.php'+ page_array[num])
            ohe('img').each( (n, el) =>{
                if (!(el.attribs['data-cfsrc'].includes("images"))){
                    href_array.push(el.attribs['data-cfsrc'])
                }
            })
        }
        
        chosenlink = href_array[Math.floor(Math.random() * href_array.length)]
        const Embed = new EmbedBuilder()
        .setColor("#000000")
        .setFooter({ text: "i have no more pasta"})
        .setTimestamp()
        .setTitle(`${author}! You asked for this.`)
        .setImage(`${chosenlink}`)
        interaction.channel.send({ embeds: [Embed]})  
            
        try {
            await interaction.reply({ content: "Ohe!", ephemeral: true})
        } catch (err) { 
            console.log(err) 
        }
    } 
    


    
    
}