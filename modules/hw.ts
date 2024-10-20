const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const config = require('../config.json')
const axios = require('axios');
const cheerio = require('cheerio')

export default {
    data: new SlashCommandBuilder()
    .setName('hw')
    .setDescription('Homework.')
    .addStringOption((option: { setName: (arg0: string) => { (): any; new(): any; setDescription: { (arg0: string): any; new(): any; }; }; }) => 
        option.setName('victim')
            .setDescription('Character name.')
            .setRequired(true)
    )
    .addStringOption((option: { setName: (arg0: string) => { (): any; new(): any; setDescription: { (arg0: string): any; new(): any; }; }; }) => 
        option.setName('tags')
            .setDescription('Tags separated by spaces (example: yuri video futa -ai_generated)')
    ),
    async execute(interaction){
        // variables
        let victim: string = interaction.options.getString('victim').toLowerCase()
        let tags: string = interaction.options.getString('tags')
        let taglist: string = "";

        // defer reply
        try {
            await interaction.deferReply()
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }

        // Append tags to one string
        if (!(tags === null)){
            tags.split(' ').forEach((tag: string) => {
                taglist += `+${tag}`
            })
        }

        // Fetch tags for character, one with the highest count gets taken
        let response;
        let data;
        try {
            response = await axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=tag&q=index&limit=25&json=1&name_pattern=${victim.replace(" ", "_")}%&order=count`)
            data = await response.data
        } catch (err){
            interaction.editReply({ content: "Couldn't connect with the Rule34 API!"});
            return;
        }

        // Parse XML using Cheerio 
        const parsed_xml = cheerio.load(data, {
            xml: true
        })
        if(parsed_xml('tags').get().length === 0){
            await interaction.editReply({ content: "Couldn't find that!" })
            return;
        }
        parsed_xml('tags').get().map(async(arg) =>{
            let highestCount = 0;
            let highestCountTag: string;
            arg.children.forEach(element => {
                if(element.attribs){
                    if(element.attribs.count > highestCount){
                        highestCount = element.attribs.count
                        highestCountTag = element.attribs.name
                    } 
                    
                }
            })
            response = await axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&json=1&tags=${highestCountTag}${taglist}+-ai_generated+-video `) // maybe cache using hash?
            
            if(!response.data){
                await interaction.editReply({ content: "Couldn't find that!" })
                return;
            }
            // random post from array
            let random_post = response.data[Math.floor(response.data.length * Math.random())]
            if(!random_post.file_url){
                random_post = response.data[Math.floor(response.data.length * Math.random())]
            }
            
            // debug for later
            console.log(random_post)
            console.log(random_post.file_url)
            
            // embed
            const Embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setFooter({ text: "lovely....!"})
                .setTimestamp()
                .setTitle(`${interaction.user.globalName}! You asked for this.`)
                .setImage(random_post.file_url)
            if(tags !== null)Embed.setDescription(`Tags: ${tags}`) // if tags are null (no tags typed in), doesn't add a description
            await interaction.editReply({ embeds: [Embed]}) // edits the deferred reply
        })
    } 
}