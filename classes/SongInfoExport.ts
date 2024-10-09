// Class to export track name, track author, track artwork, track duration, server icon uri and the server name as JSON
export class SongInfoExport {
    guildid: string;
    track: any;
    client: any;
    constructor(guildid: string, track: any, client: any){
        this.guildid = guildid
        this.track = track
        this.client = client
    };
    
    // JSON response
    get json(){
        return this.genJSON()
    }

    genJSON(){
        let guild = this.client.guilds.cache.get(this.guildid)
        return JSON.stringify({
            trackName: this.track.info.title,
            trackAuthor: this.track.info.author.replace(" - Topic", ""),
            trackArt: this.track.info.artworkUrl,
            trackDuration: this.track.info.duration,
            serverIconUrl: `https://cdn.discordapp.com/icons/${this.guildid}/${guild.icon}.png`,
            serverName: `${guild.name}`,
        })
    }
}



