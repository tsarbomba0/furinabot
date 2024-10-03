const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require('../config.json')
console.log(config)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music!')
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

        // Response and switch case for tracks
        const res = await player.search({query: query, source: platform}, interaction.user);
        switch(res.loadType){
            case "empty":
                console.log("Empty loadtype!");
                interaction.reply({ content: "Empty result from query!", ephemeral: true});
                break;
            case "track":
                player.queue.add(res.tracks[0]);
                break;
            case "playlist":
                console.log("TODO! playlist");
                res.tracks.forEach(track => {
                    player.queue.add(track);
                });
                var artworkurl = res.playlist.thumbnail
                var title = res.playlist.title
                break;
            case "search":
                player.queue.add(res.tracks[0]);
                var artworkurl = res.tracks[0].info.artworkUrl
                var title = res.tracks[0].info.title
                break;
            case "error":
                console.log("Error loadtype")
                break;
            default:
                console.log("defaulted at loadtype switch case")
                break;
        }
        
        // Embed
        const embed = new EmbedBuilder()
        .setTitle("Playing!")
        .setDescription(title)
        .setImage(artworkurl)
        .setColor(config.embed_color)
        .setFooter({ text: "À Bas l'Etat Policier" })
        .setTimestamp()

        interaction.reply({
            embeds: [embed],
        })

        // Adding to queue
        

        // Playing if the player isn't currently playing 
        if(!player.playing) {
            player.play();
        }
    }
}