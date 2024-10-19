import { SlashCommandBuilder, EmbedBuilder, Embed, ColorResolvable } from "discord.js";
import { dbfind } from '../util/mongodb_wrapper'
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("dbread")
    .setDescription("Reads roles allowed for a command")
    .addStringOption(option =>
        option.setName("command")
        .setRequired(true)
        .setDescription("Reads roles that are allowed to execute a command")
    ),
    async execute(interaction){
        let commandName = interaction.options.getString('command')

        // defer reply
        try {
            await interaction.deferReply({ ephemeral: true })
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }

        // Projection for MongoDB, show only the queried command as response
        let projection = {
            _id: 0
        }
        projection[commandName] = 1

        // Query
        let query_options = {
            projection
        }
        let query = await dbfind('perms', interaction.client.mongodb, { guildid: interaction.guild.id }, query_options)
        
        // Check if any roles were set
        if(Object.keys(query).length === 0){
            await interaction.editReply({ content: "No allowed roles set for this command!" })
            return;
        } else {
            // Evaluate roles from ids id -> role name from cache
            let roleIDArray: Array<string> = Object.values(query)[0].split(',');
            let roleNameString: string;

            roleIDArray.forEach(roleid => {
                let roleName = interaction.guild.roles.cache.get(roleid).name
                if (!roleNameString){
                    roleNameString = roleName
                } else {
                    roleNameString = roleNameString.concat(', ', roleName)
                }
                
            })
            
            // Embed
            const Embed = new EmbedBuilder()
            .setTitle(`Roles set for: /${commandName}`)
            .setDescription(roleNameString)
            .setColor(config.embed_color as ColorResolvable)
            .setTimestamp()
            .setFooter({ text: "Hell yeah!"})

            // Reply
            await interaction.editReply({ embeds: [Embed], ephemeral: true})
        }
    }
}