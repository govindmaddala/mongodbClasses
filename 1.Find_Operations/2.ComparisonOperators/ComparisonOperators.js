const { databaseConnect } = require("./0.DatabaseConnection/0.databaseConnect");


const insertData = async () => {
    var db = await databaseConnect("comparisonCollection");
    var data = [
        {
            item: [10, 20, 30, 40],
        },
        {
            item: [40, 50, 60, 70]
        }
        , {
            item: [10, 50, 70, 80]
        }
    ]

    var inserted = await db.collection.insertMany(data)
    console.log(inserted);
    /*
    '0': new ObjectId("6411f755fd84eb71430ac1ed"),
    '1': new ObjectId("6411f755fd84eb71430ac1ee"),
    '2': new ObjectId("6411f755fd84eb71430ac1ef")
    */
}
// insertData()

const comparisonOperators = async () => {
    // ObjectID = ObjectId("6411f54125027ec02906c946")
    var db = await databaseConnect("comparisonCollection");
    var greaterData = await db.collection.find({
        item: {
            $gte: 50
        }
    }).toArray()
    console.log("greaterData", greaterData); // item: [ 40, 50, 60, 70 ]  item: [ 10, 50, 70, 80 ]


    var lesserData = await db.collection.find({
        item: {
            $lt: 40
        }
    }).toArray();
    console.log("lesserData", lesserData);   // item: [ 10, 20, 30, 40 ]   item: [ 10, 50, 70, 80 ]

    var notEqualData = await db.collection.find({
        item: {
            $ne: 40
        }
    }).toArray();
    console.log("notEqualData", notEqualData);  // [ 10, 50, 70, 80 ]

    var equalData = await db.collection.find({
        item: {
            $eq: 40
        }
    }).toArray();
    console.log("equalData", equalData); // item: [ 10, 20, 30, 40 ]  item: [ 40, 50, 60, 70 ]
    await db.client.close();
}

comparisonOperators()

