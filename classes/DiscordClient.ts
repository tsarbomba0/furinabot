import { Client, ClientOptions, Collection } from 'discord.js'
import { LavalinkManager, GuildShardPayload, ManagerOptions } from 'lavalink-client'
import { MongoClient } from 'mongodb'

// MongoDB uri and client


export interface discordClientOptions extends ClientOptions {  
    uri: string
}

export default class discordClient extends Client {
    commands: Collection<string, any>;
    mongodb: MongoClient;
    lavalink: LavalinkManager;
    constructor(options: discordClientOptions) {
        super(options);
        this.commands = new Collection()
        this.mongodb = new MongoClient(options.uri);
    }
}
 