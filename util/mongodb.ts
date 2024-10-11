const mongodb_uri = "mongodb+srv://weatherUser:Auchampsdumars@cluster0.9ph1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
import { MongoClient } from "mongodb"
const mongodb = new MongoClient(mongodb_uri);

export async function read(mongoclient, query){
    try {
        await mongoclient.connect();
        let db = mongoclient.db('furina_bot_data')
        let col = db.collection('perms')
        let result = await col.findOne(query)
        return result
    } catch (err){
        console.log("An error occured with reading from MongoDB!")
        console.log(err)
    }
}
export async function write(mongoclient, query, data){
    try {
        await mongoclient.connect();
        let db = mongoclient.db('furina_bot_data')
        let col = db.collection('perms')
        await col.updateOne(query, data, {upsert: true});
    } catch (err){
        console.log("An error occured with reading from MongoDB!")
        console.log(err)
    }
}

let query = { city: "TESTCITY"}
async function main(){
    let guildid = { "guildid": "1" }
    let play = { "play": "123" }
    write(mongodb, guildid, { $set: play })
}
main();

