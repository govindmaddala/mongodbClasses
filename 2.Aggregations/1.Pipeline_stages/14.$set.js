/*
$set:
1) Adds new fields to documents. $set outputs documents that contain all existing fields from the input documents and newly added fields.
2) The $set stage is an alias for $addFields.
3) Both stages are equivalent to a $project stage that explicitly specifies all existing fields in the input documents and adds the new 
    fields.
4) You can include one or more $set stages in an aggregation operation.
5) To add field or fields to embedded documents (including documents in arrays) use the dot notation.
6) To add an element to an existing array field with $set, use with $concatArrays.
7) $set has the following form: { $set: { <newField>: <expression>, ... } }
*/


const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect");


const addFields = async () => {
    let db = await databaseConnect("aggregations", "setDemo");
    let data = [
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
    // var insertedresp = await db.collection.insertMany(data);
    // console.log("insertedresp",insertedresp);

    var pipeline = [
        {
            // $addFields: {
            $set: {
                homeworkMarks: { $sum: "$homework" },
                totalQuizMarks: { $sum: "$quiz" }
            }
        },
        {
            // $addFields: {
            $set: {
                allSum: {
                    $add: ["$homeworkMarks", "$totalQuizMarks", "$extraCredit"]
                }
            }
        }
    ]
    var resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
    await db.client.close();
}
// addFields();

var addToEmbeddedDocx = async () => {
    var db = await databaseConnect("aggregations", "set_vehicles");
    let data = [
        { _id: 1, type: "car", specs: { doors: 4, wheels: 4 } },
        { _id: 2, type: "motorcycle", specs: { doors: 0, wheels: 2 } },
        { _id: 3, type: "jet ski" }
    ]
    // var insertedResp = await db.collection.insertMany(data)
    // console.log("insertedResp", insertedResp);
    var resp = await db.collection.find({ type: "motorcycle" }).toArray();
    let pipeline = [
        {
            $match: {
                type: "motorcycle"
            },
        },
        {
            // $addFields: {
            $set: {
                "specs.fuelType": "Petrol",
                "type": "Bike" //==> chnage the name from motorcycle to Bike and these changes are temporary
            }
        }
    ]
    var after = await db.collection.aggregate(pipeline).toArray();
    console.log("before",resp);
    console.log("after",after);
    await db.client.close();
}
// addToEmbeddedDocx();

var addToArray = async () => {
    let db = await databaseConnect("aggregations", "set_scores");
    let data = [
        { _id: 1, student: "Maya", homework: [10, 5, 10], quiz: [10, 8], extraCredit: 0 },
        { _id: 2, student: "Ryan", homework: [5, 6, 5], quiz: [8, 8], extraCredit: 8 }
    ]
    // await db.collection.drop();
    // let insertedresp = await db.collection.insertMany(data);
    // console.log("insertedresp",insertedresp);
    let pipeline = [
        {
            // $addFields: {
            $set: {
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