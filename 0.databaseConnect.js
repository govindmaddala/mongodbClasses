const { MongoClient } = require('mongodb');
const url = "mongodb://127.0.0.1:27017"

const client = new MongoClient(url);

exports.databaseConnect = async (collectionName) => {
    await client.connect();
    console.log("Database is connected");
    const db = client.db("dbProject");
    const collection = db.collection(collectionName);
    return collection;
}