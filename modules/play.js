const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require('../config.json')
const ytdl = require("@distube/ytdl-core")
const { LavalinkManager } = require("lavalink-client");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play music')
        .addStringOption(option =>
            option.setName('platform')
                .setRequired(true)
                .setDescription("platform used for the track/playlist")
                .addChoices(
                    {name: "Youtube", value: "ytsearch"},
                    {name: "Spotify", value: "spsearch"},
                    {name: "Soundcloud", value: "scsearch"}
                )
        )
        .addStringOption(option => 
            option.setName('link')
                .setRequired(true)
                .setDescription('link to play')),
    
    async execute(interaction, client) {
        // Debug info
        console.log({
            guildid: `${interaction.guild.id}`,
            vcid: `${interaction.member.voice.channel.id}`,
            txtchid: `${interaction.channel.id}`
        })

        // Creating a player
        const player = client.lavalink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            selfDeaf: true,
        });
        
        // Connecting the player
        player.connect();
        
        // Query
        var query = interaction.options.getString("link")

        // Platform to use
        var platform = interaction.options.getString("platform")

        // Response 
        const res = await player.search({query: query, source: platform},interaction.user);

        // Embed
        const embed = new EmbedBuilder()
        .setTitle("Playing!")
        .setDescription(`${res.tracks[0].info.title}`)
        .setThumbnail(res.tracks[0].info.artworkUrl)
        .setColor("#000000")
        .setFooter({ text: "À Bas l'Etat Policier" })
        .setTimestamp()

        interaction.reply({
            embeds: [embed],
        })

        // Adding to queue
        player.queue.add(res.tracks[0])

        // Playing if the player isn't currently playing 
        if(!player.playing) {
            player.play();
        }
    }
}