/*
$out:

1) Takes the documents returned by the aggregation pipeline and writes them to a specified collection.
2) must be the last stage in the pipeline. 
3) The $out operator lets the aggregation framework return result sets of any size.
4) Warning: replaces the specified collection if it exists.
5) Syntax: { $out: { db: "<output-db>", coll: "<output-collection>" } }
6) Importance: 
    ==> You cannot specify a sharded collection as the output collection. And the input collection for a pipeline can be sharded. 
    ==> To output to a sharded collection, use $merge

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

var outDemo = async () => {
    let db = await databaseConnect("aggregations", "outDemo");
    // await db.collection.insertMany(data);
    var pipeline = [
        {
            $match: {
                author: "dave",
                $or:[{score:{$gte:81}},{views:{eq:521}}]
            }
        },
        {
            $out:"daveCollByOutAggregateStage"
        }
    ]
    let aggregateResp = await db.collection.aggregate(pipeline).toArray();
    console.log("aggregate", aggregateResp);

    let db2 = await databaseConnect("aggregations", "daveCollByOutAggregateStage");
    let outResp = await db2.collection.find().toArray();
    console.log(outResp);
    await db.client.close();
}
outDemo();