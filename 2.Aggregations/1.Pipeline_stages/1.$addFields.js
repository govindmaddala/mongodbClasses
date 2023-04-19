/*

Adds new fields to documents. $addFields outputs documents that contain all existing fields from the input documents and newly added fields.

The $addFields stage is equivalent to a $project stage that explicitly specifies all existing fields in the input documents and adds the new fields.

You can include one or more $addFields stages in an aggregation operation.

To add an element to an existing array field with $addFields, use with $concatArrays.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

var data = [
    {
        _id: 1,
        student: "Maya",
        homework: [10, 5, 10],
        quiz: [10, 8],
        extraCredit: 0
    },
    {
        _id: 2,
        student: "Ryan",
        homework: [5, 6, 5],
        quiz: [8, 8],
        extraCredit: 8
    }
]

var insertData = async () => {
    var db = await databaseConnect("aggregations", "addfield");
    var resp = await db.collection.insertMany(data);
    console.log(resp);
    await db.client.close();
}

// insertData();

var addFields = async () => {
    var db = await databaseConnect("aggregations", "addfield");
    var pipeline = [
        {
            $addFields: {
                homeworkMarks: { $sum: "$homework" },
                totalQuizMarks: { $sum: "$quiz" }
            }
        },
        {
            $addFields: {
                allSum: {
                    $add: ["$homeworkMarks", "$totalQuizMarks", "$extraCredit"]
                }
            }
        }
    ]
    var resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
    await db.client.close();
    /*
    {
        _id: 2,
        student: 'Ryan',
        homework: [ 5, 6, 5 ],
        quiz: [ 8, 8 ],
        extraCredit: 8,
        homeworkMarks: 16,
        totalQuizMarks: 16,
        allSum: 40
    }
    */
}

// addFields();

var addToEmbeddedDocx = async () => {
    var db = await databaseConnect("aggregations", "addfield_vehicles");
    let data = [
        { _id: 1, type: "car", specs: { doors: 4, wheels: 4 } },
        { _id: 2, type: "motorcycle", specs: { doors: 0, wheels: 2 } },
        { _id: 3, type: "jet ski" }
    ]
    // var resp = await db.collection.insertMany(data)
    var resp = await db.collection.find({ type: "motorcycle" }).toArray();
    let pipeline = [
        {
            $match: {
                type: "motorcycle"
            },
        },
        {
            $addFields: {
                "specs.fuelType": "Petrol",
                "type": "Bike" //==> chnage the name from motorcycle to Bike and these changes are temporary
            }
        }
    ]
    var after = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
    console.log(after);
    await db.client.close();
}
// addToEmbeddedDocx();

var addToArray = async () => {
    let db = await databaseConnect("aggregations", "addfield_scores");
    let data = [
        { _id: 1, student: "Maya", homework: [10, 5, 10], quiz: [10, 8], extraCredit: 0 },
        { _id: 2, student: "Ryan", homework: [5, 6, 5], quiz: [8, 8], extraCredit: 8 }
    ]
    // await db.collection.drop();
    // let resp = await db.collection.insertMany(data);
    let pipeline = [
        {
            $addFields: {
                homework: {
                    $concatArrays: ["$homework", [7], "$quiz"] 
                    //==> output is homework: [ 10, 5, 10, 7, 10, 8 ], homework: [ 5, 6, 5, 7, 8, 8 ]
                }
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
}

addToArray();


