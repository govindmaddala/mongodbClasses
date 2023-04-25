/*
  $replaceRoot
    1) Replaces the input document with the specified document. The operation replaces all existing fields in the input document, 
       including the _id field. You can promote an existing embedded document to the top level, or create a new document for promotion
    2) The $replaceRoot stage has the following form:
        { $replaceRoot: { newRoot: <replacementDocument> } }
    3) The stage errors and fails if <replacementDocument> :
        --> is not a document. 
        --> resolves to a missing document (i.e. the document does not exist),
        eg: db.collection.insertMany([
                { "_id": 1, "name" : { "first" : "John", "last" : "Backus" } },
                { "_id": 2, "name" : { "first" : "John", "last" : "McCarthy" } },
                { "_id": 3, "name": { "first" : "Grace", "last" : "Hopper" } },
                { "_id": 4, "firstname": "Ole-Johan", "lastname" : "Dahl" },
            ])
        and the error: MongoServerError: PlanExecutor error during aggregation :: caused by :: 'newRoot' expression  
            must evaluate to an object, but resulting value was: MISSING. Type of resulting value: 'missing'. Input document: {}

        How to handle this: 
         1) To avoid the error, you can use $mergeObjects to merge the name document into some default document; 
                for example: 
                    db.collection.aggregate([
                        { $replaceRoot: { newRoot: { $mergeObjects: [ { _id: "$_id", first: "", last: "" }, "$name" ] } } }
                    ])
         2) Alternatively, you can skip the documents that are missing the name field by including a $match stage to check for existence of 
            the document field before passing documents to the $replaceRoot stage:
            eg: db.collection.aggregate([
                    { $match: { name : { $exists: true, $not: { $type: "array" }, $type: "object" } } },
                    { $replaceRoot: { newRoot: "$name" } }
                ])
         3) Or, you can use $ifNull expression to specify some other document to be root; for example:
            eg: db.collection.aggregate([
                    { $replaceRoot: { newRoot: { $ifNull: [ "$name", { _id: "$_id", missingName: true} ] } } }
                ])
        
*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const checkMissingDocx = async () => {
    let db = await databaseConnect("aggregations", "checkMissingDocx")
    let data = [
        { "_id": 1, "name": { "first": "John", "last": "Backus" } },
        { "_id": 2, "name": { "first": "John", "last": "McCarthy" } },
        { "_id": 3, "name": { "first": "Grace", "last": "Hopper" } },
        { "_id": 4, "firstname": "Ole-Johan", "lastname": "Dahl" },
    ]
    // let resp = await db.collection.insertMany(data);
    let resp = await db.collection.aggregate([
        { $replaceRoot: { newRoot: "$name" } }
    ]).toArray()
    console.log("resp", resp);
    await db.client.close();
}
// checkMissingDocx();

const embeddedDocsField = async () => {
    let db = await databaseConnect("aggregations", "replaceRootEmbedDocx");
    let data = [
        { "_id": 1, "name": "Arlene", "age": 34, "pets": { "dogs": 2, "cats": 1 } },
        { "_id": 2, "name": "Sam", "age": 41, "pets": { "cats": 1, "fish": 3 } },
        { "_id": 3, "name": "Maria", "age": 25 }
    ]
    // let resp = await db.collection.insertMany(data);
    let pipeline = [
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{
                        dogs: 5, cats: 2, fish: 5, rabbit: 20
                    }, "$pets"]
                }
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
    let db = await databaseConnect("aggregations", "replaceRootDocxEmbedInArr");
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
    // console.log("insertResp",insertResp);
    let pipeline = [
        {
            $unwind: "$grades"
        },
        {
            $replaceRoot: {
                newRoot: "$grades"
            }
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
    console.log(resp);
}

// docxNested_in_array();

const newly_created_docx = async () => {
    let data = [
        { "_id": 1, "first_name": "Gary", "last_name": "Sheffield", "city": "New York" },
        { "_id": 2, "first_name": "Nancy", "last_name": "Walker", "city": "Anaheim" },
        { "_id": 3, "first_name": "Peter", "last_name": "Sumner", "city": "Toledo" }
    ]
    let db = await databaseConnect("aggregations", "replaceRootCreateNewDocx");
    // let resp = await db.collection.insertMany(data)
    let pipeline = [
        {
            $replaceRoot: {
                newRoot: {
                    fullName: {
                        $concat: ["$first_name", " ", "$last_name"]
                    }
                }
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray()
    console.log("resp", resp);
}
// newly_created_docx();

const usingRoot = async () => {
    let db = await databaseConnect("aggregations", "replaceRootUsingROOT");
    let data = [
        { "_id": 1, name: "Fred", email: "fred@example.net" },
        { "_id": 2, name: "Frank N. Stine", cell: "012-345-9999" },
        { "_id": 3, name: "Gren Dell", home: "987-654-3210", email: "beo@example.net" }
    ]

    // let resp = await db.collection.insertMany(data);
    let pipeline = [
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        { _id: "", name: "", email: "", cell: "", home: "" },
                        "$$ROOT"
                    ]
                }
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
}
usingRoot()