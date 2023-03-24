const { databaseConnect } = require("../0.databaseConnect");

const insertData = async () => {
    var data = [
        { _id: 1, subject: "coffee", author: "xyz", views: 50 },
        { _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
        { _id: 3, subject: "Baking a cake", author: "abc", views: 90 },
        { _id: 4, subject: "baking", author: "xyz", views: 100 },
        { _id: 5, subject: "Café Con Leche", author: "abc", views: 200 },
        { _id: 6, subject: "Сырники", author: "jkl", views: 80 },
        { _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
        { _id: 8, subject: "Cafe con Leche", author: "xyz", views: 10 }
    ]

    const db = await databaseConnect("textBasedDemo");
    var insertedDataResult = await db.collection.insertMany(data);
    console.log(insertedDataResult);
    await db.client.close();
}

// insertData();

const findDataWithWordCoffee = async () => {
    const db = await databaseConnect("textBasedDemo");
    var query = { $text: { $search: "\"coffee shop\"" } }
    var foundData = await db.collection.find(query).toArray();
    console.log(foundData);
    await db.client.close();
}

findDataWithWordCoffee();