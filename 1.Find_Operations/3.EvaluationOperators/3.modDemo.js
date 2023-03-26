const { databaseConnect } = require("../0.databaseConnect")

const insertData = async () => {
    var db = await databaseConnect("modDemo");
    const data = [
        { "_id": 1, "item": "a", "qty": 0 },
        { "_id": 2, "item": "b", "qty": 5 },
        { "_id": 3, "item": "c", "qty": 12 },
        { "_id": 4, "item": "d", "qty": 20 },
    ]
    await db.collection.drop();
    var inserted = await db.collection.insertMany(data);
    console.log(inserted);
    await db.client.close();
}

// insertData()

const findMultiplesOfFour = async () => {
    var db = await databaseConnect("modDemo");
    var query = {
        qty: {
            $mod: [4, 0]
        }
    }
    var muliplesOfFourData = await db.collection.find(query).toArray();
    console.log(muliplesOfFourData);
    await db.client.close();
    /*
        [
            { _id: 1, item: 'a', qty: 0 }, 
            { _id: 3, item: 'c', qty: 12 },
            { _id: 4, item: 'd', qty: 20 } 
        ]
    */
}

// findMultiplesOfFour();

const findMultiplesOfFive = async () => {
    var db = await databaseConnect("modDemo");
    var query = {
        qty: {
            $mod: [5, 0]
        }
    }
    var muliplesOfFiveData = await db.collection.find(query).toArray();
    console.log(muliplesOfFiveData);
    await db.client.close();
    /*
        [
            { _id: 1, item: 'a', qty: 0 },
            { _id: 2, item: 'b', qty: 5 },
            { _id: 4, item: 'd', qty: 20 } 
        ]
    */
}

// findMultiplesOfFive();

const findWithReminderOne = async () => {
    var db = await databaseConnect("modDemo");
    var query = {
        qty: {
            $mod: [4, 1]
        }
    }
    var findWithReminderOneData = await db.collection.find(query).toArray();
    console.log(findWithReminderOneData);
    await db.client.close();
    /*
        [ { _id: 2, item: 'b', qty: 5 } ]
    */
}

findWithReminderOne();