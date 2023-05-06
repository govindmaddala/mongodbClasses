/*

$add
1) Adds numbers together or adds numbers and a date. 
2) If one of the arguments is a date, $add treats the other arguments as milliseconds to add to the date.
3) The $add expression has the following syntax:    { $add: [ <expression1>, <expression2>, ... ] }
4) The arguments can be any valid expression as long as they resolve to either all numbers or to numbers and a date.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")
const moment = require('moment')

const addDemo = async () => {
    let db = await databaseConnect("aggregations", "addDemo");
    let data = [
        { "_id": 1, "item": "abc", "price": 10, "fee": 2, date: new Date("2014-03-01T08:00:00Z") },
        { "_id": 2, "item": "jkl", "price": 20, "fee": 1, date: new Date("2014-03-01T09:00:00Z") },
        { "_id": 3, "item": "xyz", "price": 5, "fee": 0, date: new Date("2014-03-15T09:00:00Z") },
    ]
    // await db.collection.insertMany(data);
    // await db.collection.drop()
    // let da = await db.collection.find().toArray()
    // console.log("da",da);
    let pipeline1 = [
        {
            $project: { item: 1, totaltotal: { $add: ["$price", "$fee"] } }
        }
    ]
    let response = await db.collection.aggregate(pipeline1).toArray();
    console.log("response", response);

    let pipeline2 = [
        {
            $project: { item: 1, dateAddition: { $add: ["$date", 3 * 24 * 60 * 60 * 1000] } } //adding 3 days
        }
    ]

    let dateAddtion = await db.collection.aggregate(pipeline2).toArray();
    console.log("dateAddtion", dateAddtion);
}
addDemo();