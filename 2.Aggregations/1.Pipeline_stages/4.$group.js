const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect");

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

const groupDemo = async () => {
    let db = await databaseConnect("aggregations", "group");
    // let resp = await db.collection.insertMany(data);
    let pipeline = [
        {
            $group: {
                _id: "$item",
                "totalcost": { $sum: { $multiply: ["$price", "$quantity"] } }, //==> price * Quant and then sums
                "totalQuantity": {
                    $sum: "$quantity" //=> adds sum
                },
                "cost": { $first: "$price" }, //==> returns first values of price
                "max":{$max:"$quantity"}, //==> return max value of quant
                "min":{$min:"$quantity"},  //==> return min value of quant
                "allQuantities":{$push:"$quantity"}, //==> pushes quants into allQuants
                "allDocx":{$push:"$$ROOT"} //==> pushes total docs into allDocs
            }
        }
    ]
    let ans = await db.collection.aggregate(pipeline).toArray();
    console.log(ans);
    await db.client.close();
}
groupDemo();