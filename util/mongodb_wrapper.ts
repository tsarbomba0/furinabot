import { MongoClient } from "mongodb";
// Read from MongoDB
export async function dbread(coll: string, mongoclient: MongoClient, query: object): Promise<object> {
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
export async function upsort(coll: string, mongoclient: MongoClient, query: object, data: object): Promise<void> {
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
export async function dbclear(coll: string, mongoclient: MongoClient, query: object, entry: string): Promise<void> {
    try {
        await mongoclient.connect();
        let database = mongoclient.db('furina_bot_data')
        let col = database.collection(coll)

        let obj = {};
        obj[entry] = ""

        await col.updateOne(query, { $set: obj });
    } catch (err){
        console.log("An error occured with clearing an entry on MongoDB!")
        console.log(err)
    }
}

// Find 
export async function dbfind(coll: string, mongoclient: MongoClient, query: object, options: object): Promise<object> {
    await mongoclient.db("furina_bot_data").command({ ping: 1 });
    return new Promise((res,rej) => {
        let resolve: Promise<object>;
        try {
            resolve = mongoclient.db('furina_bot_data').collection(coll).findOne(query, options)
            res(resolve)
        } catch {
            return rej("There was an error with finding the query in MongoDB")
        }
    })
}



