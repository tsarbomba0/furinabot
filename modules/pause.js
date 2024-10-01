const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection,  AudioPlayerStatus } = require("@discordjs/voice")
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses or unpauses the bot'),
    async execute(interaction){
        const player = interaction.client.getPlayer(interaction.guildId)
        if(!player.connected){
            return false
        }
        if(player.paused){
            player.resume();
            const title = "Resumed the bot!"
        } else if (player.playing){
            player.pause();
            const title = "Paused the bot!"
        } else {
            console.log("Player hasn't been playing yet!")
            const title = "Nothing was playing yet!"
        }
        const embed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle(`${title}`)
        .setTimestamp()
        .setFooter("aux Mac-Mahon, aux Dupanloup")

        await interaction.reply({embeds: [embed]})
    },
   
}