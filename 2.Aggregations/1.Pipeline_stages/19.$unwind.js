/*

$unwind
1) Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document 
    with the value of the array field replaced by the element.
2) Syntax: To unwind an array field, we can pass 
            --> a field path operand or 
            --> a document operand or 
            -->  array field path
    ==> When using this syntax, $unwind does not output a document if the field value is null, missing, or an empty array.
    ==> { $unwind: <field path> }
3) If you specify a path for a field that does not exist in an input document or the field is an empty array, $unwind, by default, 
    ignores the input document and will not output documents for that input document.
4) To output documents where the array field is missing, null or an empty array, use the "preserveNullAndEmptyArrays" option.
5) $unwind treats the sizes field as a single element array if:
        --> the field is present,
        --> the value is not null, and 
        --> the value is not an empty array.
6)  preserveNullAndEmptyArrays: to include documents whose sizes field is null, missing, or an empty array.
7)  includeArrayIndex: include the array index in the output.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const unwindDemo = async () => {
    let db = await databaseConnect("aggregations", "unwindDemo");
    let data = [
        { "_id": 1, "item": "ABC1", sizes: ["S1", "M1", "L1"] },
        { "_id": 2, "item": "ABC2", sizes: ["S2", "M2", "L2"] },
        { "_id": 3, "item": "ABC3", sizes: ["S3", "M3", "L3"] },
        //refer 5th point
        { "_id": 4, "item": "Gloves" },
        { "_id": 5, "item": "Scarf", "sizes": null },
        { "_id": 6, "item": "Shorts", "sizes": [] },
        { "_id": 7, "item": "Hat", "sizes": "M" },
    ]

    // let insertedData = await db.collection.insertMany(data);
    // console.log("insertedData", insertedData);

    let pipeline = [
        // {
        //     $unwind: "$sizes"
        // }
        {
            $unwind: {
                path: "$sizes",
                preserveNullAndEmptyArrays: true,
                includeArrayIndex: "arrayIndex" //==> adds index of element
            }
        }
    ]

    let resp_data = await db.collection.aggregate(pipeline).toArray();
    console.log("resp_data", resp_data);
    await db.client.close();
}

// unwindDemo();

const unwindEmbeddedArraysDemo = async () => {
    let db = await databaseConnect("aggregations", "unwindEmbeddedArraysDemo");
    let data = [
        {
            _id: "1",
            "items": [
                {
                    "name": "pens",
                    "tags": ["writing", "office", "school", "stationary"],
                    "price": 12.00,
                    "quantity": 5
                },
                {
                    "name": "envelopes",
                    "tags": ["stationary", "office"],
                    "price": 19.95,
                    "quantity": 8
                }
            ]
        },
        {
            _id: "2",
            "items": [
                {
                    "name": "laptop",
                    "tags": ["office", "electronics"],
                    "price": 800.00,
                    "quantity": 1
                },
                {
                    "name": "notepad",
                    "tags": ["stationary", "school"],
                    "price": 14.95,
                    "quantity": 3
                }
            ]
        }
    ]

    // let insertedData = await db.collection.insertMany(data);
    // console.log("insertedData", insertedData);

    let pipeline = [
        {
            $unwind: "$items"
        },
        {
            $unwind: "$items.tags"
        },
        {
            $group: { _id: "$items.name", quantity: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } }
        }
    ]

    let resp_data = await db.collection.aggregate(pipeline).toArray();
    console.log("resp_data", resp_data);
    await db.client.close();
}

unwindEmbeddedArraysDemo();