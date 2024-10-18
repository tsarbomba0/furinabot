import { MongoClient } from "mongodb";
// Read from MongoDB
export async function dbread(coll, mongoclient: MongoClient, query: Object){
    try {
        await mongoclient.connect();
        let database = mongoclient.db('furina_bot_data') 
        let col = database.collection(coll)
        let result = await col.findOne(query)
        return result
    } catch (err){
        console.log("An error occured with reading from MongoDB!")
        console.log(err)
    }
}

// Upsort for MongoDB
export async function upsort(coll, mongoclient: MongoClient, query: Object, data: Object){
    try {
        await mongoclient.connect();
        let database = mongoclient.db('furina_bot_data')
        let col = database.collection(coll)
        await col.updateOne(query, {$set: data}, {upsert: true});
    } catch (err){
        console.log("An error occured with writing (upsort) to MongoDB!")
        console.log(err)
    }
}

// Clear a entry in MongoDB
export async function clear(coll, mongoclient: MongoClient, query: Object, entry: String) {
    try {
        await mongoclient.connect();
        let database = mongoclient.db('furina_bot_data')
        let col = database.collection(coll)
        await col.updateOne(query, { $set: { entry: ""} });
    } catch (err){
        console.log("An error occured with clearing a entry on MongoDB!")
        console.log(err)
    }
}

// Find 
export async function dbfind(coll, mongoclient: MongoClient, query: Object, options: Object) {
    try {
        await mongoclient.connect();
        let database = mongoclient.db('furina_bot_data')
        let col = database.collection(coll)  
        let response = await col.findOne(query, options)
        return response;
    } catch (err){
        console.log("An error occured with finding a entry on MongoDB!")
        console.log(err)
    }
}



