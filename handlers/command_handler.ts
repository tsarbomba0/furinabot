import { Events, Collection } from 'discord.js';
import fs from 'node:fs';
const folderpath = '../modules'
const cmdfolder = fs.readdirSync('./modules')
import { read } from '../util/mongodb'

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
        if (interaction.member.roles.cache.has('1253312057848365086')){
            console.log("Certified pookie!")
            let query = read(client.mongodb, { guildid: interaction.guildid })
            console.log(query)
            /*
            Plan:
            read command name and query to mongodb
            check if user has any of the allowed roles
            */
        }
        let command = interaction.client.commands.get(interaction.commandName);
        if (!command){
            console.log(`Did not find: ${interaction.commandName} !`)
        }
        await command.execute(interaction)
    });
}