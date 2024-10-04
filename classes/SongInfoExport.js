const config = require('../config.json');

// Class to export track name, track author, track artwork, track duration, server icon uri and the server name as JSON
class SongInfoExport {
    constructor(guildid, track, isPlaylist, client){
        this.guildid = guildid
        this.isPlaylist = isPlaylist
        this.track = track
        this.client = client
    };

    get json(){
        return this.genJSON()
    }

    genJSON(){
        var trackArt = ""

        switch(this.isPlaylist){
            case true:
                trackArt = this.track.thumbnail
                break;
            case false: 
                trackArt = this.track.info.artworkUrl
                break;
            default:
                throw new Error('Parameter is not a boolean!')
        }

        const guild = this.client.guilds.cache.get(this.guildid)
        const trackName = this.track.info.title
        const serverIconUrl = `https://cdn.discordapp.com/icons/${this.guildid}/${guild.icon}.png`
        const serverName = `${guild.name}`
        const trackAuthor = this.track.info.author
        const trackDuration = this.track.info.duration

        const obj = {
            trackName: trackName,
            trackAuthor: trackAuthor,
            trackArt: trackArt,
            trackDuration: trackDuration,
            serverIconUrl: serverIconUrl,
            serverName: serverName,
        }
        return JSON.stringify(obj)
    }
}


module.exports = SongInfoExport
