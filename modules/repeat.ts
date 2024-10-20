import { SlashCommandBuilder, EmbedBuilder, ColorResolvable } from "discord.js"
import config from '../config.json'

export default {
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
        let resp = ""
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id)

        // defer reply
        try {
            await interaction.deferReply()
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }

        // Exits if there is no player object
        if(!player){
            interaction.reply({ content: "There is no player active!", ephemeral: true});
            return 0;
        }

        // switch case for player repeatMode from lavalink-client
        let repeat_type = interaction.options.getString('type')
        switch(player.repeatMode){
            case "off": 
                await player.setRepeatMode(repeat_type)
                resp = `Enabled repeat for the current ${repeat_type}`
                break;
            case "track":
            case "queue":
                await player.setRepeatMode('off')
                resp = `Disabled repeat for the current ${repeat_type}`
                break;
        }
        
        // embed
        const embed = new EmbedBuilder()
        .setColor(config.embed_color as ColorResolvable)
        .setTitle(resp)
        .setFooter({ text: "Wonderful audience!" })
        .setTimestamp()
        
        // reply
        interaction.editReply({ embeds: [embed]} )
        


    }
}