const config = require('../config.json')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the player!'),

    async execute(interaction){
        const player = interaction.client.lavalink.get.players(interaction.guild.id)
        if(player && interaction.user.voice.channel){
            player.destroy()
            await interaction.reply({ embeds: [
                new EmbedBuilder()
            .setTitle("Stopped!")
            .setDescription("Stopped the music player, and disconnected the bot from the channel!")
            .setColor(config.embed_color)
            .setFooter({ text: "May your light shine bright!" })
            .setTimestamp()
            ]})
        } else if (!player && interaction.user.voice.channel){
            await interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle("No music player to be stopped!")
                .setColor(config.embed_color)
                .setFooter({ text: "May your light shine bright!" })
                .setTimestamp()
            ]})
            
        } else {
            console.log("Hah!")
        }
    }
}