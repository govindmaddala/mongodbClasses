/*

$avg
1) Returns the average value of the numeric values.
2) ignores non-numeric values. If all of the operands for the average are non-numeric, $avg returns null since the average of 4
    zero values is undefined.
3) available in following aggregate stages:
    1) $addFields
    2) $bucket
    3) $bucketAuto
    4) $group
    5) $match
    6) $project
    7) $replaceRoot
    8) $replaceWith
    9) $set
    10) $setWindowFields
4) Syntax:
    When used in the $bucket, $bucketAuto, $group, and $setWindowFields stages, $avg has this syntax:
        --> { $avg: <expression> }
    In rest others: either
        --> { $avg: <expression> }  i.e $avg has one specified expression as its operand: 
                        (or)
        --> { $avg: [ <expression1>, <expression2> ... ]  } i.e $avg has a list of specified expressions as its operand
5) 

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const avgDemoInGroup = async () => {
    let data = [
        { "_id": 1, "item": "abc", "price": 10, "quantity": 2, "date": new Date("2014-01-01T08:00:00Z") },
        { "_id": 2, "item": "jkl", "price": 20, "quantity": 1, "date": new Date("2014-02-03T09:00:00Z") },
        { "_id": 3, "item": "xyz", "price": 5, "quantity": 5, "date": new Date("2014-02-03T09:05:00Z") },
        { "_id": 4, "item": "abc", "price": 10, "quantity": 10, "date": new Date("2014-02-15T08:00:00Z") },
        { "_id": 5, "item": "xyz", "price": 5, "quantity": 10, "date": new Date("2014-02-15T09:12:00Z") }
    ]
    let db = await databaseConnect("aggregations", "avgDemo");
    // let insertedResp = await db.collection.insertMany(data);

    let pipeline = [
        {
            $group: {
                _id: "$item",
                averageRateForSet: { $avg: { $multiply: ["$price", "$quantity"] } },
                averageQuantity: { $avg: "$quantity" }

            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log("resp", resp);
    await db.client.close();
}
// avgDemoInGroup();

const avgDemoInProject = async () => {
    let data = [
        { "_id": 1, "quizzes": [10, 6, 7], "labs": [5, 8], "final": 80, "midterm": 75 },
        { "_id": 2, "quizzes": [9, 10], "labs": [8, 8], "final": 95, "midterm": 80 },
        { "_id": 3, "quizzes": [4, 5, 5], "labs": [6, 5], "final": 78, "midterm": 70 }
    ]
    let db = await databaseConnect("aggregations", "avgDemoInProject");
    let insertedResp = await db.collection.insertMany(data);

    let pipeline = [
        {
            $project: {
                quizAvg: { $avg: "$quizzes" },
                labAvg: { $avg: "$labs" },
                examAvg:{$avg:["$final","$midterm"]}
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log("resp", resp);
    await db.client.close();
}
avgDemoInProject();
