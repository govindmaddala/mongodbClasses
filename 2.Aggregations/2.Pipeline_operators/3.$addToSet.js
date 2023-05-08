/*

$addToSet
1) returns an array of all unique values that results from applying an expression to each document in a group.
2) The order of the elements in the returned array is unspecified.
3) can be used in the following stages:
    --> $bucket
    --> $bucketAuto
    --> $group
    --> $setWindowFields
4) Syntax: { $addToSet: <expression> }

Behaviour: If the value of the expression is 
    --> an array, $addToSet appends the whole array as a single element.
    --> a document, MongoDB determines that the document is a duplicate if another document in the array matches the to-be-added 
        document exactly. Specifically, the existing document has the exact same fields and values in the exact same order.
    
*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const addToSetDemo = async () => {
    let db = await databaseConnect("aggregations", "addToSetDemo")
    let data = [
        { "_id": 1, "item": "abc", "price": 10, "quantity": 2, "date": new Date("2014-01-01T08:00:00Z") },
        { "_id": 2, "item": "jkl", "price": 20, "quantity": 1, "date": new Date("2014-02-03T09:00:00Z") },
        { "_id": 3, "item": "xyz", "price": 5, "quantity": 5, "date": new Date("2014-02-03T09:05:00Z") },
        { "_id": 4, "item": "abc", "price": 10, "quantity": 10, "date": new Date("2014-02-15T08:00:00Z") },
        { "_id": 5, "item": "xyz", "price": 5, "quantity": 10, "date": new Date("2014-02-15T09:12:00Z") },
    ]
    // await db.collection.insertMany(data)
    let pipeline = [
        {
            $group: {
                _id: { day: { $dayOfYear: "$date" }, year: { $year: "$date" } },
                itemsSold: { $addToSet: "$item" }
            }
        }

        /*
        
            [
                { _id: { day: 46, year: 2014 }, itemsSold: [ 'abc', 'xyz' ] },
                { _id: { day: 1, year: 2014 }, itemsSold: [ 'abc' ] },
                { _id: { day: 34, year: 2014 }, itemsSold: [ 'jkl', 'xyz' ] }
            ]
        
        */

    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log("resp", resp);
    await db.client.close();
}
addToSetDemo()