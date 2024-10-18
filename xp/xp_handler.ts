import { Events } from 'discord.js'
import { dbfind, upsort } from '../util/mongodb';

// Variables
let cooldownIds: Array<string> = [];
let timeoutCreated = false;
let timeoutCooldownId: string;
const givenXP = 25;
const milisecondsCooldown = 10000;

export default function count_xp(client){
    client.on(Events.MessageCreate, async (message) => {
        // if the message has no guildid, like a dm, exit
        if(message.guildId === null){
            return;
        } 

        // user id and guild id specification
        let userId = message.member.id
        let guildId: string;

        // get guildId, and create a 'cooldown id' (combined userId and guildId
        guildId = message.guildId
        let cooldownId = userId.concat(guildId)
        console.log(cooldownIds)

        // if statement checks if cooldownId is present in the array
        if(!cooldownIds.includes(cooldownId)){
            let data = {};

            let projection = { _id: 0}
            projection[userId] = 1

            let currentXp: Object = await dbfind('exp', client.mongodb, { guildid: guildId }, {projection})
            currentXp = currentXp ? currentXp : {}

            if(Object.keys(currentXp).length === 0){
                data[userId] = givenXP
                upsort('exp', client.mongodb, { guildid: guildId }, data)
            } else {
                data[userId] = Object.values(currentXp)[0] + givenXP
                upsort('exp', client.mongodb, { guildid: guildId }, data)
            }


            // if not it pushes it to the array
            cooldownIds.push(cooldownId)
            // checks if a setTimeout was already triggered and if the timeout has the same id as the cooldown
            if(timeoutCreated && timeoutCooldownId == cooldownId){
                console.log("timeout already exists!")
            } else {
                // sets timeoutCreated as true and sets timeoutCooldownId as the cooldownId
                timeoutCreated = true;
                timeoutCooldownId = cooldownId

                // setTimeout function 
                setTimeout(function(){
                    console.log("Assez de sang!")
                    //cooldownIds.splice(cooldownId.indexOf(cooldownId), 1); // remove cooldownId from array
                    cooldownIds = cooldownIds.filter(id => id !== cooldownId)
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