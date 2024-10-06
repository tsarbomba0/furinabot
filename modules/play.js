const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../config.json')
const { soundcloud_playlist_regex, soundcloud_track_regex, spotify_playlist_regex, spotify_track_regex, youtube_playlist_regex, youtube_track_regex,} = require('../util/regex.ts')
let platform = "ytsearch";
let title;
let artworkurl;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music!')
        .addStringOption(option => 
            option.setName('link')
                .setRequired(true)
                .setDescription('link to play')),
    
    async execute(interaction, client) {
        // Query
        let query = interaction.options.getString("link")
        
        // Checking which search should be used
        if (query.match(youtube_track_regex) !== null | query.match(youtube_playlist_regex) !== null){
            platform = "ytsearch"
        } else if (query.match(spotify_track_regex) !== null | query.match(spotify_playlist_regex) !== null){
            platform = "spsearch"
        } else if (query.match(soundcloud_track_regex) !== null | query.match(soundcloud_playlist_regex) !== null){
            platform = "scsearch"
        }

        // Creating a player
        const player = client.lavalink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            selfDeaf: true,
        });
        
        // Connecting the player
        player.connect();

        // Response and switch case for tracks
        const res = await player.search({query: query, source: platform}, interaction.user);
        switch(res.loadType){
            case "empty":
                interaction.reply({ content: "Empty result from query!", ephemeral: true });
                break;

            case "track":
            case "search":
                player.queue.add(res.tracks[0]);
                artworkurl = res.tracks[0].info.artworkUrl
                title = res.tracks[0].info.title
                break;

            case "playlist":
                console.log(res)
                res.tracks.forEach(track => {
                    player.queue.add(track);
                });
                artworkurl = res.playlist.thumbnail
                title = res.playlist.title
                break;
            
            case "error":
                interaction.reply({ content: "An error occured!", ephemeral: true });
                return;
                break;

            default:
                console.log("This shouldn't happen...")
                return;
                break;
        }
        
        // Playing if the player isn't currently playing 
        if(!player.playing) {
            player.play();
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
        
    }
}