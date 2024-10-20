import config from '../config.json';
import { SlashCommandBuilder, EmbedBuilder, Embed, ColorResolvable } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the queue'),

    async execute(interaction){
        // get player and check if the player exists (undefined if not)
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
        if(!player){ 
            interaction.reply({ content: "There is no player active!", ephemeral: true});
            return;
        } else if(!player.queue){ 
            interaction.reply({ content: "The player has no queue!", ephemeral: true});
            return;
        }

        // defer reply
        try {
            await interaction.deferReply()
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }

        // All tracks
        let entire_queue = player.queue.previous.concat(player.queue.tracks, player.queue.current)

        // Shuffle the queue
        for (var i = entire_queue.length - 1; i >= 0; i--){
            var num = Math.floor(Math.random as any * (i+1))
            var temporary = entire_queue[i]
            entire_queue[i] = entire_queue[num]
            entire_queue[num] = temporary;

        }

        // Clear entire player queue
        player.queue.tracks.splice(0, player.queue.tracks.length)
        
        // Assign new queue to the player.queue object
        entire_queue.forEach(track => {
            player.queue.add(track)
        });

        // Embed
        const Embed = new EmbedBuilder()
        .setColor(config.embed_color as ColorResolvable)
        .setTitle("Shuffled the queue!")
        .setTimestamp()
        .setFooter({ text: "What is this, Mouloudji?"})

        try {
            await interaction.editReply({ embeds: [Embed]})
        } catch (err){
            console.log(err)
            await interaction.editReply("Shuffled the playlist! - fallback response!")
        }
    }
} 