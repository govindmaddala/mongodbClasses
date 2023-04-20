const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const limitDemo = async () => {
    const db = await databaseConnect("aggregations", "limit");
    // await db.collection.drop();
    var data = [
        { "_id": 1, "item": "abc", "price": parseFloat("10"), "quantity": parseInt("2"), },
        { "_id": 2, "item": "jkl", "price": parseFloat("20"), "quantity": parseInt("1"), },
        { "_id": 3, "item": "xyz", "price": parseFloat("5"), "quantity": parseInt("10"), },
        { "_id": 4, "item": "xyz", "price": parseFloat("5"), "quantity": parseInt("20"), },
        { "_id": 5, "item": "abc", "price": parseFloat("10"), "quantity": parseInt("10"), },
        { "_id": 6, "item": "def", "price": parseFloat("7.5"), "quantity": parseInt("5"), },
        { "_id": 7, "item": "def", "price": parseFloat("7.5"), "quantity": parseInt("10"), },
        { "_id": 8, "item": "abc", "price": parseFloat("10"), "quantity": parseInt("5"), },
    ]
    // var resp = await db.collection.insertMany(data);
    let pipeline = [
        {
            $limit:5
        },
        {
            $sort:{
                quantity:1,price:1
            }
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
    await db.client.close();
}
limitDemo();