const config = require('../config.json')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the queue'),

    async execute(interaction){
        // get player and check if the player exists (undefined if not)
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
        if(!player){ 
            interaction.reply({ content: "There is no player active!", ephemeral: true});
            return 0;
        }
        // check if player.queue exists
        if(!player.queue){ 
            interaction.reply({ content: "The player has no queue!", ephemeral: true});
            return 0;
        }

        // All tracks
        var entire_queue = player.queue.previous.concat(player.queue.tracks, player.queue.current)

        // Shuffle the queue
        for (var i = entire_queue.length - 1; i >= 0; i--){
            var num = Math.floor(Math.random * (i+1))
            var temporary = entire_queue[i]
            entire_queue[i] = entire_queue[num]
            entire_queue[num] = temporary;

        }

        // Clear entire player queue
        player.queue.tracks.splice(0, player.queue.tracks.length)

        console.log(entire_queue)
        // Assign new queue to the player.queue object
        entire_queue.forEach(track => {
            player.queue.add(track)
        });

    }
} 