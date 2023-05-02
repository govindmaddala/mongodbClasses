/*

$abs:
1)  Returns the absolute value of a number.
2)  Syntax: { $abs: <number> }
3)  The <number> expression can be any valid expression as long as it resolves to a number.
4)  Example                 Result
    { $abs: -1 }              1
    { $abs: 1 }               1
    { $abs:  null}           null
    { $abs:  NaN }           NaN

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const absDemo = async () => {
    let db = await databaseConnect("aggregations", "abs");
    let data = [
        { _id: 1, start: 5, end: 8 },
        { _id: 2, start: 4, end: 4 },
        { _id: 3, start: 9, end: 7 },
        { _id: 4, start: 6, end: 7 }
    ]
    // await db.collection.insertMany(data);
    let pipeline = [
        {
            $project: { difference: { $abs: { $subtract: ["$start", "$end"] } } }
        }
    ]
    let response = await db.collection.aggregate(pipeline).toArray();
    console.log("response", response);
}
absDemo();