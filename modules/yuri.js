const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const config = require('../config.json')
const axios = require('axios');
const cheerio = require('cheerio')
const unholy_link = "https://rule34.xxx/index.php?page=post&s=list&tags=furina_%28genshin_impact%29+yuri+-ai_generated+-smelly+-video+-fart+-bloated"

let next_page_array=[]
let c = 0
let page_array=[]
let href_array=[]

module.exports = {
    data: new SlashCommandBuilder()
    .setName('yuri')
    .setDescription('Sends yuri content of Furina')
    .addStringOption(option => 
        option.setName('victim')
            .setDescription('Character name.')
    ),

    async execute(interaction){
        let author = interaction.user.globalName
        
        
        const $ = await cheerio.fromURL(unholy_link)
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
            let ohe = await cheerio.fromURL('https://rule34.xxx/index.php'+ page_array[num])
            ohe('img').each( (n, el) =>{
                if (!(el.attribs['data-cfsrc'].includes("images"))){
                    href_array.push(el.attribs['data-cfsrc'])
                }
            })
        }
        
        chosenlink = href_array[Math.floor(Math.random() * href_array.length)]
        const Embed = new EmbedBuilder()
        .setColor(config.embed_color)
        .setFooter({ text: "lovely....!"})
        .setTimestamp()
        .setTitle(`${author}! You asked for this.`)
        .setImage(`${chosenlink}`)
            
        try {
            await interaction.reply({ embeds: [Embed] })
        } catch (err) { 
            console.log(err) 
        }
    } 
    


    
    
}