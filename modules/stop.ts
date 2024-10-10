import config from '../config.json'
import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the player!'),

    async execute(interaction){
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
        if(player && interaction.member.voice.channel.id === player.voiceChannelId){
            player.destroy()
            await interaction.reply({ embeds: [
                new EmbedBuilder()
            .setTitle("Stopped!")
            .setDescription("Stopped the music player, and disconnected the bot from the channel!")
            .setColor(config.embed_color as ColorResolvable)
            .setFooter({ text: "May your light shine bright!" })
            .setTimestamp()
            ]})
        } else if (!player){
            await interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle("No music player to be stopped!")
                .setColor(config.embed_color  as ColorResolvable)
                .setFooter({ text: "May your light shine bright!" })
                .setTimestamp()
            ]})
            
        } else {
            console.log("Hah!")
        }
    }
}