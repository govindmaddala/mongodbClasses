/*
$replaceWith:
1) Replaces the input document with the specified document. The operation replaces all existing fields in the input document, 
   including the _id field.
2) The $replaceWith is an alias for $replaceRoot.
3) Syntax: { $replaceWith: <replacementDocument> }
4) If the <replacementDocument> is not a document, $replaceWith errors and fails.

Refer rest other notes from replaceRoot or from mongodb documentation since both are almost same
*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect");

const embeddedDocsField = async () => {
    let db = await databaseConnect("aggregations", "replaceWithEmbedDocx");
    let data = [
        { "_id": 1, "name": "Arlene", "age": 34, "pets": { "dogs": 2, "cats": 1 } },
        { "_id": 2, "name": "Sam", "age": 41, "pets": { "cats": 1, "fish": 3 } },
        { "_id": 3, "name": "Maria", "age": 25 }
    ]
    // let respInsert = await db.collection.insertMany(data);
    // console.log("respInsert",respInsert);
    let pipeline = [
        {
            $replaceWith: {
                // newRoot: {
                $mergeObjects: [{
                    dogs: 5, cats: 2, fish: 5, rabbit: 20
                }, "$pets"]
                // }
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    /*
    Explanation:
    1) The $mergeObjects expression merges the specified default document with the pets document.
    2) $replaceRoot stage is to replace each input document with the result of a $mergeObjects operation.
    */
    console.log(resp);
}
// embeddedDocsField();

const docxNested_in_array = async () => {
    let db = await databaseConnect("aggregations", "replaceWithDocxEmbedInArr");
    let data = [
        {
            "_id": 1,
            "grades": [
                { "test": 1, "grade": 80, "mean": 75, "std": 6 },
                { "test": 2, "grade": 85, "mean": 90, "std": 4 },
                { "test": 3, "grade": 95, "mean": 85, "std": 6 }
            ]
        },
        {
            "_id": 2,
            "grades": [
                { "test": 1, "grade": 90, "mean": 75, "std": 6 },
                { "test": 2, "grade": 87, "mean": 90, "std": 3 },
                { "test": 3, "grade": 91, "mean": 85, "std": 4 }
            ]
        }
    ]
    // let insertResp = await db.collection.insertMany(data);
    // console.log("insertResp", insertResp);
    let pipeline = [
        {
            $unwind: "$grades"
        },
        {
            // $replaceRoot: {
            //     newRoot: "$grades"
            // }
            $replaceWith: "$grades"
        },
        {
            $match: { grade: { $gt: 85 } }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    /*
    Explanation:
    1) The $mergeObjects expression merges the specified default document with the pets document.
    2) $replaceRoot stage is to replace each input document with the result of a $mergeObjects operation.
    */
    console.log("docxNested_in_array", resp);
}
// docxNested_in_array();

const newly_created_docx = async () => {
    let data = [
        { "_id": 1, "item": "butter", "price": 10, "quantity": 2, date: "2019-03-01T08:00:00Z", status: "C" },
        { "_id": 2, "item": "cream", "price": 20, "quantity": 1, date: "2019-03-01T09:00:00Z", status: "A" },
        { "_id": 3, "item": "jam", "price": 5, "quantity": 10, date: "2019-03-15T09:00:00Z", status: "C" },
        { "_id": 4, "item": "muffins", "price": 5, "quantity": 10, date: "2019-03-15T09:00:00Z", status: "C" }
    ]
    let db = await databaseConnect("aggregations", "replaceWithCreateNewDocx");
    // let insertResp = await db.collection.insertMany(data)
    // console.log("insertResp",insertResp);
    let pipeline = [
        {
            // $replaceRoot: {
            //     newRoot: {
            //         fullName: {
            //             $concat: ["$first_name", " ", "$last_name"]
            //         }
            //     }
            // }
            $replaceWith:{
                item_name:"$item",
                amount:{$multiply:["$price","$quantity"]},
                status:"COMPLETE",
                asOfNow:"$$NOW"
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray()
    console.log("resp", resp);
}
// newly_created_docx();

const usingRoot = async () => {
    let db = await databaseConnect("aggregations", "replaceWithUsingROOT");
    let data = [
        { "_id": 1, name: "Fred", email: "fred@example.net" },
        { "_id": 2, name: "Frank N. Stine", cell: "012-345-9999" },
        { "_id": 3, name: "Gren Dell", home: "987-654-3210", email: "beo@example.net" }
    ]

    // let insertResp = await db.collection.insertMany(data);
    // console.log("insertResp",insertResp);
    let pipeline = [
        {
            $replaceWith: {
                // newRoot: {
                    $mergeObjects: [
                        { _id: "", name: "", email: "", cell: "", home: "" },
                        "$$ROOT"
                    ]
                // }
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
}
usingRoot()