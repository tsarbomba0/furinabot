import { Events } from 'discord.js'
import { dbfind, upsort } from '../util/mongodb_wrapper';
import { xpcalc } from './xp_calc';
import { calculatedLevel } from '../interfaces/calculatedLevel';
// Variables
let cooldownIds: Array<string> = [];
let timeoutCreated = false;
let timeoutCooldownId: string;
const givenXP = 25;
const milisecondsCooldown = 20000;

export default function count_xp(client){
    client.on(Events.MessageCreate, async (message) => {
        // if the message has no guildid, like a dm, exit
        if(message.guildId === null || message.member.id === client.user.id){
            return;
        } 

        // user id and guild id specification
        let userId = message.member.id
        let guildId: string;

        // get guildId, and create a 'cooldown id' (combined userId and guildId)
        guildId = message.guildId
        let cooldownId = userId.concat(guildId)
        console.log("Cooldown IDs: ", cooldownIds)

        // if statement checks if cooldownId is present in the array
        if(!cooldownIds.includes(cooldownId)){
            let data: object = {}; 

            // Projection for MongoDB, only show field with <userId>
            let projection = { _id: 0 }
            projection[userId] = 1

            // Put to array
            cooldownIds.push(cooldownId)

            // Current
            let userData: Object = await dbfind('exp', client.mongodb, { guildid: guildId }, {projection})
            userData = userData ? userData : {} // if null, change to empty object

            if(Object.keys(userData).length === 0){
                // if there is no value for a userid/guild or both, insert a new one with level 0 and the base amount of xp
                data[userId] = {
                    level: 0,
                    xp: 0
                }
                upsort('exp', client.mongodb, { guildid: guildId }, data)
            } else {
                // Variables, levelObjectValues => object from userId 
                let levelObjectValues: Object = Object.values(userData)[0]
                console.log(levelObjectValues)
                let xpNumber = Number(Object.values(levelObjectValues)[1]) // first property of the object
                let level = Number(Object.values(levelObjectValues)[0]) // second property ^
                console.log(xpNumber)
                console.log(level)
                let newXp = xpNumber+givenXP
                // data object to upsert into MongoDB
                let lvl = xpcalc(newXp, level) 
                console.log(lvl)
                data[userId] = {
                    level: lvl.level,
                    xp: lvl.xp
                } 
                console.log(data)
                // Upsort
                //upsort('exp', client.mongodb, { guildid: guildId }, data)
                
            }


            // checks if a setTimeout was already triggered and if the timeout has the same id as the cooldown
            if(timeoutCreated && timeoutCooldownId == cooldownId){
                console.log("timeout already exists!")
            } else {
                // sets timeoutCreated as true and sets timeoutCooldownId as the cooldownId
                timeoutCreated = true;
                timeoutCooldownId = cooldownId

                // setTimeout function 
                setTimeout(function(){
                    //cooldownIds.splice(cooldownId.indexOf(cooldownId), 1); // remove cooldownId from array
                    cooldownIds = cooldownIds.filter(id => id !== cooldownId) // uses .filter to remove duplicates in case of some lag
                    console.log(cooldownIds) // debug
                    timeoutCreated = false; // set timeoutCreated to false, as it now ended
                    timeoutCooldownId = '0' // set timeoutCooldownId as 0 (string), ^
                }, milisecondsCooldown) 
            }
        } else {
            console.log("On cooldown!")
        }
    }
)
}