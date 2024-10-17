import { Events } from 'discord.js'

// Variables
let cooldownIds: Array<string> = [];
let timeoutCreated = false;
let timeoutCooldownId: string;

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
            /*
            TODO: Rest of XP stuff
            */
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
                    cooldownIds.splice(cooldownId.indexOf(cooldownId), 1); // remove cooldownId from array
                    console.log(cooldownIds) // debug
                    timeoutCreated = false; // set timeoutCreated to false, as it now ended
                    timeoutCooldownId = '0' // set timeoutCooldownId as 0 (string), ^
                }, 10000) // 10 second cooldown
            }
        } 
    }
)
}