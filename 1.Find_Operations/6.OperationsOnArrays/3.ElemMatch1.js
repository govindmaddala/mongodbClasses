const { databaseConnect } = require("../../0.DatabaseConnection/0.databaseConnect");

const insertData = async () => {
    const db = await databaseConnect("embeddedDocx");
    const data = [
        { results: [82, 88, 89] },
        { results: [75, 90, 87] },
    ]

    const insertedData = await db.collection.insertMany(data);
    console.log(insertedData);
    await db.client.close();
}

// insertData();


const findDataWithBetween80And85WithAnd = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        $and:[{results:{$gte:80}},{results:{$lte:85}}]
    }
    const foundData = await db.collection.find(query).toArray();
    console.log(foundData); //==> results: [ 82, 88, 89 ],[ 75, 90, 87 ]
    await db.client.close();
}

findDataWithBetween80And85WithAnd();

const findDataWithBetween80And85 = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        results: { $elemMatch: { $gte: 80, $lte: 85 } }
    }
    const foundData = await db.collection.find(query).toArray();
    console.log(foundData);  // ==>  results: [ 82, 88, 89 ]
    await db.client.close();
}

// findDataWithBetween80And85();