import { clear } from '../util/mongodb'
import { SlashCommandBuilder } from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
    .setName("database")
    .setDescription("write to database")
    .addStringOption(option => 
        option.setName("activity")
            .setRequired(true)
            .addChoices(
                { name: "Read", value: "read" },
                { name: "Set", value: "set" },
                { name: "Clear", value: "clear"},
            )
            .setDescription("What to do!")
    )
    .addStringOption(option =>
        option.setName("command")
            .setRequired(true)
            .setDescription("Command to set permissions for!")
    )
    .addStringOption(option =>
        option.setName("roles")
            .setRequired(true)
            .setDescription("Role names to set as allowed to execute a given command!")
    ),

    
    async execute(interaction){
        let mongoclient = interaction.client.mongodb
        await clear(mongoclient, { guildid: "1"}, "play")

        
    }
}