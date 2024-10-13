const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const config = require('../config.json')
const axios = require('axios');
const parseString = require('xml2js').parseString;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('yuri')
    .setDescription('Sends yuri content')
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
        let author = interaction.user.globalName
        let victim = interaction.options.getString('victim').toLowerCase()
        let tags = interaction.options.getString('tags')
        let taglist = "";

        // defer reply
        await interaction.deferReply()

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
            console.log(victim.replace(" ", "_"))
            data = await response.data
        } catch (err){
            interaction.editReply({ content: "Couldn't connect with the Rule34 API!", ephemeral: true});
            return;
        }

        console.log(data)
        // parse XML
        parseString(data, async (err: any, result)=>{
            // on error
            if(err){
                interaction.editReply({ content: "Something went wrong during parsing the output from Rule34!", ephemeral: true})
            }

            // character name from highest count tag
            let charname;
            try {
                charname = result.tags.tag[result.tags.tag.length - 1].$.name
            } catch (err){
                console.log(err)
                await interaction.editReply({ content: "Couldn't find that!", ephemeral: true})
                return;
            }
            // response from API regarding a query for charname and the taglist
            response = await axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&json=1&tags=${charname}${taglist}+-ai_generated`) // maybe cache using hash?
            // random post from array
            let random_post = response.data[Math.floor(response.data.length * Math.random())]
            console.log(random_post.file_url)
            // embed
            const Embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setFooter({ text: "lovely....!"})
                .setTimestamp()
                .setTitle(`${author}! You asked for this.`)
                .setImage(random_post.file_url)
            if(tags !== null)Embed.setDescription(`Tags: ${tags}`) // if tags are null (no tags typed in), doesn't add a description
            await interaction.editReply({ embeds: [Embed]}) // edits the deferred reply
        })   
    } 
}