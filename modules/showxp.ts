import { dbfind } from '../util/mongodb_wrapper'
import config from '../config.json'
import { SlashCommandBuilder, EmbedBuilder, GuildMember, Embed, ColorResolvable, Collection } from 'discord.js'
import { Experience } from '../interfaces/exp'

export default {
    data: new SlashCommandBuilder()
    .setName("showxp")
    .setDescription("Show someone's xp or yours (if you provide no input)")
    .addStringOption(option => 
        option
            .setName("user")
            .setDescription("The global username of the person you wish to inspect!")

    ),

    async execute(interaction){
        let option = interaction.options.getString("user")
        console.log(option)
        await interaction.deferReply()
        let userId: string;
        let userName: string;
        let avatarHash: string;
        if(option){
            let info: Collection<string, any> = await interaction.guild.members.search({ query: option })
            info.map(member => {
                userId = member.user.id
                userName = member.user.globalName
                avatarHash = member.user.avatar
            })
        } else {
            let info: GuildMember = await interaction.guild.members.cache.get(interaction.user.id)
            userId = info.user.id
            userName = info.user.globalName
            avatarHash = info.user.avatar
        }

        // Query object
        let query = {}
        query['guildid'] = interaction.guildId
        query[userId] = { '$exists': 'true' }

        // Projection
        let proj = { _id: 0 }
        proj[userId] = 1

        let xpEntry = await dbfind('exp', interaction.client.mongodb, query, {sort: {}, projection: proj})
        if(xpEntry === null){
            await interaction.editReply({ content: "This user has no XP data yet!", ephemeral: true})
            return;
        }

        let xpObject = Object.values(xpEntry)[0]

        let exp: Experience = {
            level: Object.values(xpObject)[0] as number, 
            xp: Object.values(xpObject)[1] as number, 
            xpLevelup: ((Object.values(xpObject)[0] as number + 1)**2 + 100)*10 // formula
        }

        await interaction.editReply({ embeds: [
            new EmbedBuilder()
            .setTitle(`${userName}'s experience`)
            .setDescription(`**Level ${exp.level}** ${exp.xp}/${exp.xpLevelup}`)
            .setColor(config.embed_color as ColorResolvable)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.jpeg?size=64x64`)
        ]})
        
    }
}