import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputApplicationCommandData, Embed, Interaction, SlashCommandBuilder } from "discord.js"
const config = require('../config.json')
export default {
    data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips song in playing queue'),

    async execute(interaction){
        if(!interaction.member.voice.channel){
            interaction.reply({ content: "You are not in a voice channel!", ephemeral: true})
            return;
        }
        // defer reply
         try {
            await interaction.deferReply()
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }

        let player = interaction.client.lavalink.getPlayer(interaction.guild.id)
        player.skip();

        const Embed = new EmbedBuilder()
        .setTitle("Skipped a song!")
        .setColor(config.embed_color)
        .setTimestamp()
        .setFooter({ text: "Hahahaha!" })
        await interaction.editReply({ embeds: [Embed]})
    }
}