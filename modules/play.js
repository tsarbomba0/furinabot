const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection,  AudioPlayerStatus } = require("@discordjs/voice")
const config = require('../config.json')
const ytdl = require("@distube/ytdl-core")
const { LavalinkManager, Queue, QueueSaver } = require("lavalink-client");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play music')
        .addStringOption(option => 
            option.setName('link')
                .setRequired(true)
                .setDescription('link to play')),
    
    async execute(interaction, client) {
        console.log({
            guildid: `${interaction.guild.id}`,
            vcid: `${interaction.member.voice.channel.id}`,
            txtchid: `${interaction.channel.id}`
        })
        //console.log(interaction.client.moonlink)
        const player = client.lavalink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            selfDeaf: true,
        });
        

        var a = player.connect();
        if (a===true){
            console.log("Player connected!")
        } else {
            console.log("Player did not connect, something went wrong!")
        }
        
        // Query
        var query = interaction.options.getString("link")

        // Response 
        const res = await player.search({query: query, source: 'youtube'},interaction.user);
        console.log(res)
        interaction.reply({
            content: `Playing ${res.tracks[0].info.title}`,
            ephemeral: true
        })
        //console.log(res.tracks[0].info)

        player.queue.add(res.tracks[0])

        // Playing if the player isn't currently playing 
        if(!player.playing) {
            player.play();
        }
    }
}