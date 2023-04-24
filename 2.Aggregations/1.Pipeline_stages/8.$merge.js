/* 
$merge:
    1) Writes the results of the aggregation pipeline to a specified collection.
    2) The $merge operator must be the last stage in the pipeline.
    3) Can output to a collection in the same or different database.
    4) Read operations of the $merge statement are sent to secondary nodes, 
        while the write operations occur only on the primary node.
    5) Creates a new collection if the output collection does not already exist.
    6) Can incorporate results (insert new documents, merge documents, replace documents, 
        keep existing documents, fail the operation, process documents with a custom update pipeline) into an existing collection.
    7) Can output to a sharded collection. Input collection can also be sharded.
    8) On-Demand Materialized Views
        ==> can incorporate the pipeline results into an existing output collection rather than perform a full replacement of the collection. 
        This functionality allows users to create on-demand materialized views, where the content of the output collection is incrementally 
        updated when the pipeline is run.

        ==> Materialized views are separate from read-only views. 
    9) syntax :
        {
            $merge: {
                into: <collection> -or- { db: <db>, coll: <collection> },
                on: <identifier field> -or- [ <identifier field1>, ...],  // Optional
                let: <variables>,                                         // Optional
                whenMatched: <replace|keepExisting|merge|fail|pipeline>,  // Optional
                whenNotMatched: <insert|discard|fail>                     // Optional
            }
        }
    
    10) If using all default options for $merge including writing to a collection in the same database, you can use the simplified form:
        { $merge: <collection> } // Output collection is in the same database

    Considerations:
        ==> _id Field Generation
            If the _id field is not present in a document from the aggregation pipeline results, the $merge stage generates it automatically.
        ==> Create a New Collection if Output Collection is Non-Existent
            - creates a new collection if the specified output collection does not exist.
            - The output collection is created when $merge writes the first document into the collection and is immediately visible.
            - If the aggregation fails, any writes completed by the $merge before the error will not be rolled back.
        ==> For a sharded cluster, the specified output database must already exist.
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

var mergeDemo = async () => {
    let db = await databaseConnect("aggregations", "mergeDemo");
    // await db.collection.insertMany(data);
    var pipeline = [
        {
            $match: {
                author: "dave",
                $or: [{ score: { $gte: 81 } }, { views: { eq: 521 } }]
            }
        },
        {
            $merge: {
                into: "collectionCreatedByMerge"
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    let db2 = await databaseConnect("aggregations", "collectionCreatedByMerge");
    let mergeResp = await db2.collection.find().toArray();
    console.log(mergeResp);
    await db.client.close();
}
mergeDemo();