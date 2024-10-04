const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../config.json')
const SongInfoExport = require('../classes/SongInfoExport.js')

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
        console.log(interaction.client.express)
        // Creating a player
        const player = client.lavalink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            selfDeaf: true,
        });
        
        // Connecting the player
        player.connect();
        
        // Variable for song information 
        var songinfo = ""

        // Query
        var query = interaction.options.getString("link")

        // Platform to use
        var platform = interaction.options.getString("platform")

        // Response and switch case for tracks
        const res = await player.search({query: query, source: platform}, interaction.user);

        switch(res.loadType){
            case "empty":
                interaction.reply({ content: "Empty result from query!", ephemeral: true});
                break;

            case "track":
            case "search":
                player.queue.add(res.tracks[0]);
                var artworkurl = res.tracks[0].info.artworkUrl
                var title = res.tracks[0].info.title
                songinfo = new SongInfoExport(interaction.guild.id, res.tracks[0], false, interaction).json
                break;

            case "playlist":
                res.tracks.forEach(track => {
                    player.queue.add(track);
                });
                var artworkurl = res.playlist.thumbnail
                var title = res.playlist.title
                songinfo = new SongInfoExport(interaction.guild.id, res.playlist, true, interaction).json
                break;
            
            case "error":
                console.log("Error loadtype")
                break;

            default:
                console.log("Defaulted at loadtype switch case")
                break;
        }
        
        // Attachment and filenames
        const file = `./img/music_players/${platform.replace("search", '')}50.png`
        const filename = `${platform.replace("search", '')}50.png`
        const attachment = new AttachmentBuilder(file)

        // Embed
        const embed = new EmbedBuilder()
        .setTitle("Playing!")
        .setDescription(title)
        .setThumbnail(`attachment://${filename}`)
        .setImage(artworkurl)
        .setColor(config.embed_color)
        .setFooter({ text: "À Bas l'Etat Policier" })
        .setTimestamp()

        interaction.reply({
            embeds: [embed],
            files: [attachment],
        })

        // debug for song info
        console.log(JSON.parse(songinfo))

        // Playing if the player isn't currently playing 
        if(!player.playing) {
            player.play();
        }
    }
}