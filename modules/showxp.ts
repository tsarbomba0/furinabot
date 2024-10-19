import { dbfind } from '../util/mongodb_wrapper'
import config from '../config.json'
import { SlashCommandBuilder, EmbedBuilder, GuildMember } from 'discord.js'
import { Experience } from '../interfaces/exp'

module.exports = {
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
        await interaction.deferReply()
        if(option !== null){
            let userInfo = await interaction.guild.members.search({ query: option })
            let userId: string;
            let userName: string;

            userInfo.map(info => {
                userId = info.user.id
                userName = info.user.globalName
            })

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
            console.log(xpEntry)
            const exp: Experience = {
                xp: Object.values(xpObject)[0] as number, 
                level: Object.values(xpObject)[1] as number, 
                xpLevelup: ((Object.values(xpObject)[1] as number + 1)**2 + 100)*10 // formula
            }
            console.log(exp)
            await interaction.editReply(`${userName}: ${exp.xp}/${exp.xpLevelup} Level ${exp.level}!`)
        }
    }
}