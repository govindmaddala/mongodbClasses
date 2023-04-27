/*
$sample:
1) Randomly selects the specified number of documents from the input documents.
2) Syntax: { $sample: { size: <positive integer N> } }


Behavior:
   If all of the following conditions are true, $sample uses a pseudo-random cursor to select the N documents:
        -> $sample is the first stage of the pipeline.
        -> N is less than 5% of the total documents in the collection.
        -> The collection contains more than 100 documents.
   If any of the previous conditions are false, $sample:
        -> Reads all documents that are output from a preceding aggregation stage or a collection scan.
        -> Performs a random sort to select N documents.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect");

const sampleDemo = async () => {
    let db = await databaseConnect("aggregations", "sample");
    let data = [
        { "_id": 1, "name": "dave123", "q1": true, "q2": true },
        { "_id": 2, "name": "dave2", "q1": false, "q2": false },
        { "_id": 3, "name": "ahn", "q1": true, "q2": true },
        { "_id": 4, "name": "li", "q1": true, "q2": false },
        { "_id": 5, "name": "annT", "q1": false, "q2": true },
        { "_id": 6, "name": "li", "q1": true, "q2": true },
        { "_id": 7, "name": "ty", "q1": false, "q2": true }
    ]
    // let insertResp = await db.collection.insertMany(data);
    // console.log("insertResp",insertResp);
    let pipeline = [
        {
            $sample:{size:4}
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
}
sampleDemo();