import { Events, Collection } from 'discord.js';
import fs from 'node:fs';
const folderpath = '../modules'
const cmdfolder = fs.readdirSync('./modules')
import { dbfind } from '../util/mongodb'


// Modules for slash commands
export function modules(client){
    client.commands = new Collection();
for (let folder in cmdfolder){
    console.log(`Loaded: ${cmdfolder[folder]}`)
    const command = require(`${folderpath}/${cmdfolder[folder]}`)
    client.commands.set(command.data.name, command);
}

}

// Slash commands
export function interaction_handler(client){
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()){return};
        let command = interaction.client.commands.get(interaction.commandName);
        if (!command){
            console.log(`Did not find: ${interaction.commandName} !`)
            return;
        }

        // Query options
        let projection: Object = { _id: 0 }
        projection[command.data.name] = 1
        let options: Object = {
            sort: {},
            projection
        }
        
        // Query object
        let query_obj: Object = {}
        query_obj[command.data.name] = { '$exists': 'true' }
        query_obj['guildid'] = interaction.guild.id 
        let query: Object = await dbfind(client.mongodb, { 'guildid': interaction.guild.id }, options)

        // Check if query is empty
        let role_ids: Array<string> // role id array
        if (!(Object.keys(query).length === 0)){
            role_ids = query[`${command.data.name}`].split(',') // Allowed role id array for command
        } else if (interaction.user.id !== interaction.guild.ownerId || interaction.user.id !== "416621261930627073"){
            role_ids = [] // Empty if user is a owner or a special one (ME)
        } else {
            await interaction.reply({ content: "There are no permissions configured for this command!", ephemeral: true});
            return;
        }

        
         
        

        // Check if user is allowed to execute command
        let allowedRole = false
        let user = interaction.guild.members.cache.get(interaction.user.id)
        for (let role of user.roles.cache){
            if(role_ids.includes(role[0])){
                allowedRole = true;
                break;
            }
        }

        // Exit if user doesn't have any roles that allow for execution of given command
        if (!allowedRole && interaction.user.id !== interaction.guild.ownerId && interaction.user.id !== "416621261930627073"){
            await interaction.reply({ content: "You are not allowed to use this command!", ephemeral: true })
            return;
        }    
        
        await command.execute(interaction)
    });
}