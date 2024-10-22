import { Client, ClientOptions, Collection } from 'discord.js'
import { LavalinkManager, GuildShardPayload, ManagerOptions } from "lavalink-client"
import { MongoClient } from 'mongodb'

// MongoDB uri and client
export default class discordClient extends Client {
    commands: Collection<string, any>;
    mongodb: MongoClient;
    lavalink: LavalinkManager;
    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection()
    }
}
 