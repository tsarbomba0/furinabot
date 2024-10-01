const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection,  AudioPlayerStatus } = require("@discordjs/voice")
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses or unpauses the bot'),
    async execute(interaction){
        var title = "";
        if(interaction.client.lavalink.getPlayer(interaction.guild.id) === undefined){
            console.log("No player!")
            return 0;
        } 

        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);
        if(!player.connected){
            console.log("Player not connected!")
            return 0
        }
        if(player.paused){
            player.resume();
            title = "Resumed the bot!"
        } else if (player.playing){
            player.pause();
            title = "Paused the bot!"
        } else {
            console.log("Player hasn't been playing yet!")
            title = "Nothing was playing yet!"
        }
        const embed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle(`${title}`)
        .setTimestamp()
        .setFooter({ text: "aux Mac-Mahon, aux Dupanloup"})

        await interaction.reply({embeds: [embed]})
    },
   
}