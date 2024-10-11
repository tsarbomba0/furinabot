import { MongoClient } from "mongodb";
// Read from MongoDB
export async function read(mongoclient: MongoClient, query: Object){
    try {
        await mongoclient.connect();
        let database = mongoclient.db('furina_bot_data') 
        let col = database.collection('perms')
        let result = await col.findOne(query)
        return result
    } catch (err){
        console.log("An error occured with reading from MongoDB!")
        console.log(err)
    }
}

// Upsort for MongoDB
export async function upsort(mongoclient: MongoClient, query: Object, data: Object){
    try {
        await mongoclient.connect();
        let database = mongoclient.db('furina_bot_data')
        let col = database.collection('perms')
        await col.updateOne(query, data, {upsert: true});
    } catch (err){
        console.log("An error occured with writing (upsort) to MongoDB!")
        console.log(err)
    }
}

// Clear a entry in MongoDB
export async function clear(mongoclient: MongoClient, query: Object, entry: String) {
    try {
        await mongoclient.connect();
        let database = mongoclient.db('furina_bot_data')
        let col = database.collection('perms')
        await col.updateOne(query, { entry: ""});
    } catch (err){
        console.log("An error occured with clearing a entry on MongoDB!")
        console.log(err)
    }
}



