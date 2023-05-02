/*
$unset:
1) Removes/excludes fields from documents.
2) Syntax: The $unset stage has the following syntax:
    --> To remove a single field, the $unset takes a string that specifies the field to remove:
            { $unset: "<field>" }
    --> To remove multiple fields, the $unset takes an array of fields to remove.
            { $unset: [ "<field1>", "<field2>", ... ] }
    --> for embedded docx: 
        ==> { $unset: "<field.nestedfield>" }
        ==> { $unset: [ "<field1.nestedfield>", ...] }
3) The $unset is an alias for the $project stage that removes/excludes fields:
    { $project: { "<field1>": 0, "<field2>": 0, ... } }

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const unsetDemo = async () => {
    let db = await databaseConnect("aggregations", "unsetDemo");
    let data = [
        { "_id": 1, title: "Antelope Antics", isbn: "0001122223334", author: { last: "An", first: "Auntie" }, copies: [{ warehouse: "A", qty: 5 }, { warehouse: "B", qty: 15 }] },
        { "_id": 2, title: "Bees Babble", isbn: "999999999333", author: { last: "Bumble", first: "Bee" }, copies: [{ warehouse: "A", qty: 2 }, { warehouse: "B", qty: 5 }] }
    ]

    // let insertedData = await db.collection.insertMany(data);
    // console.log("insertedData", insertedData);

    let pipeline = [
        {
            $unset: "copies"
        },
        {
            $unset:["title","_id","author.last"]
        }
    ]

    let dataResp = await db.collection.aggregate(pipeline).toArray();
    console.log("dataResp", dataResp);
}

unsetDemo();