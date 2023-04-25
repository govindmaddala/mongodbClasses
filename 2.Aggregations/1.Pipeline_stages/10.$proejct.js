/*
$project: 
    1) Passes along the documents with the requested fields to the next stage in the pipeline. 
        The specified fields can be existing fields from the input documents or newly computed fields.
    2) Syntax: { $project: { <specification(s)> } }
    3) Specifications have the following forms:
        - <field>: <1 or true>  ==> inclusion of a field. Non-zero integers are also treated as true.
                  : <0 or false> ==> suppression or exclusion of the field.
                  : <expression> If the the expression evaluates to $$REMOVE, the field is excluded in the output.
    4) Embedded Document Fields: Either use dot notation (Or) you can nest the fields
        == dot notation: eg: "contact.address.country": <1 or 0 or expression>
        == nesting field notation: eg: contact: { address: { country: <1 or 0 or expression> } }
        Note: When nesting the fields, you cannot use dot notation inside the embedded document to specify the field, 
            e.g. contact: { "address.country": <1 or 0 or expression> } is invalid.
    5) Path Collision Errors in Embedded Fields
        You cannot specify both an embedded document and a field within that embedded document in the same projection.
        The following $project stage fails with a Path collision error because it attempts to project both the embedded 
        contact document and the contact.address.country field:
        { $project: { contact: 1, "contact.address.country": 1 } }
    
    Note:
        * When you use a $project stage it should typically be the last stage in your pipeline, used to specify which fields to return to the client.
        * Using a $project stage at the beginning or middle of a pipeline to reduce the number of fields passed to subsequent pipeline stages is unlikely 
           to improve performance, as the database performs this optimization automatically.
    
    Restrictions
        * An error is returned if the $project specification is an empty document.
        * You cannot use an array index with the $project stage.
    
    *** $unset stage can also be used to exclude fields.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect");

const insertData = async () => {
    let db = await databaseConnect("aggregations", "projectDemo");
    await db.collection.drop();
    let data = [{
        "_id": 1,
        title: "abc123",
        isbn: "0001122223334",
        author: { last: "zzz", first: "aaa" },
        copies: 5
    },
    {
        "_id": 2,
        title: "Baked Goods",
        isbn: "9999999999999",
        author: { last: "xyz", first: "abc", middle: "" },
        copies: 2,
        lastModified: "2017-07-21"
    },
    {
        "_id": 3,
        title: "Ice Cream Cakes",
        isbn: "8888888888888",
        author: { last: "xyz", first: "abc", middle: "mmm" },
        copies: 5,
        lastModified: "2017-07-22"
    }]
    let resp = await db.collection.insertMany(data);
    console.log(resp);
    await db.client.close();
}
// insertData();

const includeSpecificField = async () => {
    let db = await databaseConnect("aggregations", "projectDemo");
    let pipeline = [
        {
            $project: {
                title: 1,
                author: 1,
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log("resp", resp);
}

// includeSpecificField();

const suppressIDField = async () => {
    let db = await databaseConnect("aggregations", "projectDemo");
    let pipeline = [
        {
            $project: {
                _id: 0,
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log("resp", resp);
}

// suppressIDField();

const excludeFields = async () => {
    let db = await databaseConnect("aggregations", "projectDemo");
    let pipeline = [
        {
            $project: {
                "author.first": 0,
                title: 0
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log("resp", resp);
}

// excludeFields();

const excludeFromEmbeddedDocx = async () => {
    let db = await databaseConnect("aggregations", "projectDemo");
    let dot_notation_pipeline = [
        {
            $project: {
                "author.first": 0
            }
        }
    ]
    let resp1 = await db.collection.aggregate(dot_notation_pipeline).toArray();
    console.log("resp1", resp1);

    let embedded_notation_pipeline = [
        {
            $project: {
                author: {
                    first: 0
                }
            }
        }
    ]

    let resp2 = await db.collection.aggregate(embedded_notation_pipeline).toArray();
    console.log("resp2", resp2);
}
// excludeFromEmbeddedDocx();

const conditionallyExcludingFields = async () => {
    let db = await databaseConnect("aggregations", "projectDemo");

    let pipeline = [
        {
            $project: {
                title: 1,
                "author.first": 1,
                "author.last": 1,
                "author.middleChanged": {
                    $cond:{
                        if:{$eq:["","$author.middle"]},
                        then:"$$REMOVE",
                        else:"$author.middle"
                    }
                }, //==> if middle not exists, return '' and condition removes and middle will not be returned
                "author.middle":1 //==> if middle not exists, return ''

            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log("resp", resp);
}
conditionallyExcludingFields();