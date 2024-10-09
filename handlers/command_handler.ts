import { Events, Collection } from 'discord.js';
import fs from 'node:fs';
const folderpath = '../modules'
const cmdfolder = fs.readdirSync('./modules')

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
    client.on(Events.InteractionCreate, async (interaction: { isChatInputCommand: () => boolean; client: { commands: { get: (arg0: string) => any; }; }; commandName: string; }) => {
        if (!interaction.isChatInputCommand()){return};
        let command = interaction.client.commands.get(interaction.commandName);
        if (!command){
            console.log(`Did not find: ${interaction.commandName} !`)
        }
        await command.execute(interaction)
    });
}