import { SlashCommandBuilder, EmbedBuilder } from "discord.js";



module.exports = {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses or unpauses the bot'),
    async execute(interaction){
        var title = "";
        
        // If there is no player it just quits.
        if(interaction.client.lavalink.getPlayer(interaction.guild.id) === undefined){
            console.log("No player!")
            return 0;
        } 

        // player variable
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);

        // Logic to check if the player is connected.
        if(!player.connected){
            console.log("Player not connected!")
            return 0
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
        .setColor('#000000')
        .setTitle(`${title}`)
        .setTimestamp()
        .setFooter({ text: "aux Mac-Mahon, aux Dupanloup"})

        await interaction.reply({embeds: [embed]})
    },
   
}