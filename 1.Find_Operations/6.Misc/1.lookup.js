const { databaseConnect } = require("./0.DatabaseConnection/0.databaseConnect");
const { ObjectId } = require('mongodb');

const insertData = async () => {
    var db = await databaseConnect("mainCollection");
    var insertData = {
        name: "govind",
        city: "Anakapalle"
    }
    var insertedData = await db.collection.insertOne(insertData)

    var db2 = await databaseConnect("refCollection");
    var query2 = {
        jobDetails: {
            job: [
                { company: "JSW STEELS", salary: 45000 },
                { company: "Enmovil", salary: 29000 },
            ]
        }
    }
    console.log(insertedData.insertedId);
    query2.ref = insertedData.insertedId;
    db2.collection.insertOne(query2)
}

// insertData() 

const lookUp = async () => {
    // var mainColl = await databaseConnect("mainCollection");
    var db = await databaseConnect("refCollection");
    var query = {
        $lookup: {
            from: "mainCollection",
            localField: "ref",
            foreignField: "_id",
            as: "CandidateName"
        }
    }

    var userData = await db.collection.aggregate([
        query
    ]).toArray();
    console.log(userData);
}

lookUp()