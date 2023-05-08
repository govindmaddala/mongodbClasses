/*

$allElementsTrue
1) Evaluates an array as a set and returns true if no element in the array is false. Otherwise, returns false. An empty array returns true.
2) Syntax: { $allElementsTrue: [ <expression> ] }
    ==> <expression> itself must resolve to an array, separate from the outer array that denotes the argument list. 
Behaviour:
 --> If a set contains a nested array element, $allElementsTrue does not descend into the nested array but evaluates the array at top-level.
 --> In addition to the false boolean value, $allElementsTrue evaluates as false the following: null, 0, and undefined values. 
 --> The $allElementsTrue evaluates all other values as true, including non-zero numeric values and arrays.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const allElementsTrueDemo = async () => {
    let db = await databaseConnect("aggregations", "allElementsTrue");
    let data = [
        { "_id": 1, "responses": [true] },                          //True
        { "_id": 2, "responses": [true, false] },                   //false
        { "_id": 3, "responses": [] },                              //true
        { "_id": 4, "responses": [1, true, "seven"] },              //true
        { "_id": 5, "responses": [0] },                             //false
        { "_id": 6, "responses": [[]] },                            //true
        { "_id": 7, "responses": [[0]] },                           //true
        { "_id": 8, "responses": [[false]] },                       //true
        { "_id": 9, "responses": [null] },                          //false
        { "_id": 10, "responses": [undefined] }                     //false
    ]
    // await db.collection.insertMany(data);

    let pipeline = [
        {
            $project:{_id:0, "responses":1, itemsTrue:{$allElementsTrue:["$responses"]}}
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
}
allElementsTrueDemo()