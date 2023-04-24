/*
$match: 
1) Filters the documents to pass only the documents that match the specified condition(s) to the next pipeline stage.
2) similar to query provided in find
*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")
const ObjectId = require('mongodb').ObjectId;

var data = [
    { "_id": new ObjectId("512bc95fe835e68f199c8686"), "author": "dave", "score": 80, "views": 100 },
    { "_id": new ObjectId("512bc962e835e68f199c8687"), "author": "dave", "score": 85, "views": 521 },
    { "_id": new ObjectId("55f5a192d4bede9ac365b257"), "author": "ahn", "score": 60, "views": 1000 },
    { "_id": new ObjectId("55f5a192d4bede9ac365b258"), "author": "li", "score": 55, "views": 5000 },
    { "_id": new ObjectId("55f5a1d3d4bede9ac365b259"), "author": "annT", "score": 60, "views": 50 },
    { "_id": new ObjectId("55f5a1d3d4bede9ac365b25a"), "author": "li", "score": 94, "views": 999 },
    { "_id": new ObjectId("55f5a1d3d4bede9ac365b25b"), "author": "ty", "score": 95, "views": 1000 }
]

var matchDemo = async () => {
    let db = await databaseConnect("aggregations", "matchDemo");
    // await db.collection.insertMany(data);
    var queryForFind = {
        author: "dave",
        $or:[{score:{$gte:81}},{views:{eq:521}}]
    }
    var pipeline = [
        {
            $match: {
                author: "dave",
                $or:[{score:{$gte:81}},{views:{eq:521}}]
            }
        }
    ]
    let findResp = await db.collection.find(queryForFind).toArray();
    let aggregateResp = await db.collection.aggregate(pipeline).toArray();
    console.log("find", findResp);
    console.log("aggregate", aggregateResp);
    await db.client.close();
}
matchDemo();