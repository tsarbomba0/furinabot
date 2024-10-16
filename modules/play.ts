import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ColorResolvable } from "discord.js";
import config from '../config.json';
import { SearchQuery, SearchResult, Track } from "lavalink-client/dist/types";
const { RegexList } = require('../types/platforms');
let title: string;
let artworkurl: string;
let platform = "ytsearch";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music!')
        .addStringOption(option => 
            option.setName('link')
                .setRequired(true)
                .setDescription('link to play')),
    
    async execute(interaction) {

        // defer reply
        try {
            await interaction.deferReply()
        } catch (err) {
            await interaction.reply({ content: "Something really went wrong!", ephemeral: true})
            return;
        }

        // Query
        let query = interaction.options.getString("link")
        
        // Checking which search should be used
        if (query.match(RegexList.yt_track) !== null || query.match(RegexList.yt_playlist) !== null){
            platform = "ytsearch"
        } else if (query.match(RegexList.sp_playlist) !== null || query.match(RegexList.sp_playlist) !== null){
            platform = "spsearch"
        } else if (query.match(RegexList.sp_playlist) !== null || query.match(RegexList.sp_playlist) !== null){
            platform = "scsearch"
        }

        if(interaction.member.voice.channel === null){
            await interaction.editReply({ content: "You aren't in a voice channel!", ephemeral: true })
            return;
        }

        // Creating a player
        const player = interaction.client.lavalink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            selfDeaf: true,
            selfMute: false
        });
        
        // Connecting the player
        player.connect();

        // Response and switch case for tracks
        let res: SearchResult;
        
        
        try {
            res = await player.search({query: query, source: platform}, interaction.user);
            switch(res.loadType){
                case "empty":
                    await interaction.editReply({ content: "Empty result from query!", ephemeral: true });
                    break;
    
                case "track":
                case "search":
                    player.queue.add(res.tracks[0]);
                    artworkurl = res.tracks[0].info.artworkUrl
                    title = res.tracks[0].info.title
                    break;
    
                case "playlist":
                    res.tracks.forEach(track => {
                        player.queue.add(track);
                    });
                    artworkurl = res.playlist.thumbnail
                    title = res.playlist.title
                    break;
    
                default:
                case "error":
                    interaction.editReply({ content: "An error occured!", ephemeral: true });
                    return;
                    break;
            }
        } catch (err){
            console.log(err)
            await interaction.editReply({ content: "Something went wrong during the search!", ephemeral: true })
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
        try { 
            const embed = new EmbedBuilder()
            .setTitle("Playing!")
            .setDescription(title)
            .setThumbnail(`attachment://${filename}`)
            .setImage(artworkurl)
            .setColor(config.embed_color as ColorResolvable)
            .setFooter({ text: "À Bas l'Etat Policier" })
            .setTimestamp()
        
            await interaction.editReply({
                embeds: [embed],
                files: [attachment],
            
            }) 
        } catch (err) {
            await interaction.editReply(`Playing - ${title} (this is a fallback message, report if it happens)`)
        }  
        
    }
}