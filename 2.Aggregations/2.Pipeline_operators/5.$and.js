/*

$and:
1) Evaluates one or more expressions and returns true if all of the expressions are true or if run with no argument expressions. Otherwise, 
   $and returns false.
2) Syntax: { $and: [ <expression1>, <expression2>, ... ] }
3) $and evaluates false, 0, undefined as false and rest other values including non-zero numeric values and arrays as true.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const add_with_aggregation = async () => {
    let db = await databaseConnect("aggregations", "andWithAggregations");
    let data = [
        { "_id": 1, "item": "abc1", description: "product 1", qty: 300 },
        { "_id": 2, "item": "abc2", description: "product 2", qty: 200 },
        { "_id": 3, "item": "xyz1", description: "product 3", qty: 250 },
        { "_id": 4, "item": "VWZ1", description: "product 4", qty: 300 },
        { "_id": 5, "item": "VWZ2", description: "product 5", qty: 180 }
    ]
    // let resp = await db.collection.insertMany(data);
    // console.log("resp",resp);
    let pipeline = [
        {
            $match: {
                $and: [{ qty: { $gte: 180 } }, { qty: { $lte: 250 } }]
                //{ _id: 2, item: 'abc2', description: 'product 2', qty: 200 }
            }
        },
        {
            $project: { _id: 0, item: 1, result: { $and: [{ $gte: ["$gty", 180] }, { $lte: ["$qty", 250] }] } } 
            // here gte should be given like this only
            //{ item: 'abc2', result: false }
        }
    ]

    let dataGot = await db.collection.aggregate(pipeline).toArray();
    console.log("dataGot", dataGot);
    await db.client.close();
}

add_with_aggregation()