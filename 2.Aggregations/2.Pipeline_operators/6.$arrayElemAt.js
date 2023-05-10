/*

$arrayElemAt
1) Returns the element at the specified array index.
2) Syntax: { $arrayElemAt: [ <array>, <idx> ] }
   ---> if <idx> resolves to be:
        ==> 0 or +ve numbers: counting from the start of the array.
        ==> -ve numbers: counting from the end of the array.
        ==> exceeds the array bounds: does not return a result.
3) If the <array> expression resolves to an undefined array, $arrayElemAt returns null.
4) --> [ [ 1, 2, 3 ], 0 ]   ===> 1
   --> [ [ 1, 2, 3 ], -2 ]  ===> 2
   --> [ [ 1, 2, 3 ], 15 ]
   --> [ "$undefinedField", 0 ] ==> null

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const arrayElemAt_demo = async () => {
    let db = await databaseConnect("aggregations", "arrayElemAt");
    let data = [
        { "_id": 1, "name": "dave123", favorites: ["chocolate", "cake", "butter", "apples"] },
        { "_id": 2, "name": "li", favorites: ["apples", "pudding", "pie"] },
        { "_id": 3, "name": "ahn", favorites: ["pears", "pecans", "chocolate", "cherries"] },
        { "_id": 4, "name": "ty", favorites: ["ice cream"] }
    ]

    // await db.collection.insertMany(data);
    let pipeline = [
        {
            $project: {
                _id: 0,
                positive: { $arrayElemAt: ["$favorites", 1] },
                negative: { $arrayElemAt: ["$favorites", -1] },
                outOfBound: { $arrayElemAt: ["$favorites", 10] },
            }
            /*
                { positive: 'cake', negative: 'apples' },    
                { positive: 'pudding', negative: 'pie' },    
                { positive: 'pecans', negative: 'cherries' },
                { negative: 'ice cream' }
            */
        },
        {
            $project: {
                fullName: { $concat: ["$positive", " ", "$negative"] }
            }
            /*
                { fullName: 'cake apples' },
                { fullName: 'pudding pie' },
                { fullName: 'pecans cherries' },
                { fullName: null }
            */
        }
    ]

    let response = await db.collection.aggregate(pipeline).toArray();
    console.log("response", response);
    await db.client.close();
}
arrayElemAt_demo()