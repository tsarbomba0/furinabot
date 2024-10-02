const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Repeats the current track or queue")
    .addStringOption(option =>
        option.setName("type")
        .setDescription("Repeat track or queue? (Do it again to disable)")
        .addChoices(
            { name: "Track", value: 'track'},
            { name: "Queue", value: 'queue'},
        )
        .setRequired(true)),
    async execute(interaction){
        var resp = ""
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id)

        // Exits if there is no player object
        if(!player){
            interaction.reply({ content: "There is no player active!", ephemeral: true});
            return 0;
        }

        // switch case for player repeatMode from lavalink-client
        switch(player.repeatMode){
            case "off": 
                await player.setRepeatMode(interaction.options.getString('type'))
                resp = `Enabled repeat for the current ${interaction.options.getString('type')}`
                break;
            case "track":
                await player.setRepeatMode('off')
                resp = `Disabled repeat for the current ${interaction.options.getString('type')}`
                break;
            case "queue":
                await player.setRepeatMode('off')
                resp = `Disabled repeat for the current ${interaction.options.getString('type')}`
                break;
        }
        console.log(config.embed_color)
        // embed
        const embed = new EmbedBuilder()
        .setColor(config.embed_color)
        .setTitle(resp)
        .setFooter({ text: "Wonderful audience!" })
        .setTimestamp()
        
        // reply
        interaction.reply({ embeds: [embed]} )
        


    }
}