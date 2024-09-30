const { SlashCommandBuilder } = require("discord.js");

var repeat_boolean = false;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('repeat current song or playlist')
    .addStringOption(option =>
        option.setName('option')
            .setDescription('Your choice.')
            .setRequired(true)
            .addChoices(
                { name: 'Song', value: 'song'},
                { name: 'Playlist', value: 'playlist'}
            )
    ),
    async execute(interaction){
        
    }
}