import { MongoClient } from 'mongodb'
import { upsort } from '../util/mongodb_wrapper'
import { SlashCommandBuilder } from 'discord.js'
import fs from 'node:fs';

module.exports = {
    data: new SlashCommandBuilder()
    .setName("dbwrite")
    .setDescription("write to database")
    .addStringOption(option =>
        option.setName("command")
            .setRequired(true)
            .setDescription("Command to set permissions for!")
    )
    .addStringOption(option =>
        option.setName("roles")
            .setDescription("Role names to set permissions (use commas, like: role1, role2, role3)")
            .setRequired(true)
    ),

    
    async execute(interaction){
        let command: string = interaction.options.getString('command')
        let roles: Array<string> = interaction.options.getString('roles').split(',')
        let mongoclient: MongoClient = interaction.client.mongodb
        let role_ids: Array<string> = [];
        let cmd_dir: Array<string> = fs.readdirSync('./modules')

        // defer reply
        try {
            await interaction.deferReply()
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }

        // Check if command is present (if not, return)
        if (!cmd_dir.includes(`${command}.ts`)){
            interaction.reply({ content: "This command doesn't exist", ephemeral: true})
            return;
        }

        // fetch roles 
        interaction.guild.roles.fetch()
        .then(result => {
            result.map(m => {
                roles.forEach(rolename => {
                    rolename = rolename.trim()
                    if (m.name.toLowerCase() === rolename.toLowerCase()){
                        console.log(m.id)
                        if (m.id){
                            role_ids.push(m.id)
                        }       
                    }
                })
            })

            // Empty object
            let data: Object = {}

            // Assign command name as key and role ids separated by commas as value
            data[`${command}`] = `${role_ids.toString()}`
            console.log(data)
            try {
                upsort('perms', mongoclient, { guildid: interaction.guild.id }, data)
            } catch (err){
                console.log(err)
                interaction.reply({ content: "An error occured!", ephemeral: true})
            }
            
        })
        .catch(err => console.log(err))
        // reply
        await interaction.editReply({ content: `Done! Set permissions for /${command}`, ephemeral: true}) 
        
            

        
    }
}