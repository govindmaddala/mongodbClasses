const { databaseConnect } = require("./0.databaseConnect");
const { ObjectId } = require('mongodb');

const insertData = async () => {
    var coll = await databaseConnect("mainCollection");
    var insertData = {
        name: "govind",
        city: "Anakapalle"
    }
    var insertedData = await coll.insertOne(insertData)

    var coll2 = await databaseConnect("refCollection");
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
    coll2.insertOne(query2)
}

// insertData() 

const lookUp = async () => {
    // var mainColl = await databaseConnect("mainCollection");
    var refColl = await databaseConnect("refCollection");
    var query = {
        $lookup: {
            from: "mainCollection",
            localField: "ref",
            foreignField: "_id",
            as: "CandidateName"
        }
    }

    var userData = await refColl.aggregate([
        query
    ]).toArray();
    console.log(userData);
}

lookUp()