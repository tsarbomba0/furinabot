import { MongoClient } from 'mongodb'
import { upsort } from '../util/mongodb'
import { SlashCommandBuilder } from 'discord.js'
import fs from 'node:fs';

module.exports = {
    data: new SlashCommandBuilder()
    .setName("database")
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
            return role_ids
                })
        .then(role_ids  => {
            console.log(role_ids)
            let cmd_dir = fs.readdirSync('./modules')
            let command_names: Array<string> = [];
            let data: Object = {}
            let folderpath = '../modules'

            data[`${command}`] = `${role_ids.toString(',')}`
            console.log(data)
            upsort(mongoclient, { "guildid": interaction.guild.id }, data)
            
            /* GET WORKING!
            for (let folder in cmd_dir){
                console.log(`Loaded: ${cmd_dir[folder]}`)
                command_names.push(`${folderpath}/${cmdfolder[folder]}`)
    
            }
            */
        })
        .catch(err => console.log(err))
            

        
    }
}