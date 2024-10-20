import { SlashCommandBuilder, EmbedBuilder, ColorResolvable } from "discord.js";
import config from '../config.json';
export default {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses or unpauses the bot'),
    async execute(interaction){
        var title = "";

        // defer reply
        try {
            await interaction.deferReply()
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }
        
        // If there is no player it just quits.
        if(interaction.client.lavalink.getPlayer(interaction.guild.id) === undefined){
            interaction.editReply({ content: "Bot is not connected to any voice channel", ephemeral: true})
            return;
        } 

        // player variable
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);

        // Logic to check if the player is connected.
        if(!player.connected){
            interaction.editReply({ content: "Bot is not connected to any voice channel", ephemeral: true})
            return;
        }

        // Logic to check if player is paused or not.
        if(player.paused){
            player.resume();
            title = "Resumed the bot!"
        } else if (player.playing){
            player.pause();
            title = "Paused the bot!"
        } 
        
        // Embed.
        const embed = new EmbedBuilder()
        .setColor(config.embed_color as ColorResolvable)
        .setTitle(`${title}`)
        .setTimestamp()
        .setFooter({ text: "aux Mac-Mahon, aux Dupanloup"})

        await interaction.editReply({embeds: [embed]})
    },
   
}