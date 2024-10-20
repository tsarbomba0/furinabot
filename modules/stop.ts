import config from '../config.json'
import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the player!'),

    async execute(interaction){
        // defer reply
        try {
            await interaction.deferReply()
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }

        const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
        if(player && interaction.member.voice.channel.id === player.voiceChannelId){
            player.destroy()
            await interaction.editReply({ embeds: [
                new EmbedBuilder()
            .setTitle("Stopped!")
            .setDescription("Stopped the music player, and disconnected the bot from the channel!")
            .setColor(config.embed_color as ColorResolvable)
            .setFooter({ text: "May your light shine bright!" })
            .setTimestamp()
            ]})
        } else if (!player){
            await interaction.editReply({ embeds: [
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