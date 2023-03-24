const { databaseConnect } = require("../0.databaseConnect");

const insertData = async () => {
    const db = await databaseConnect("exprDemo");
    const data = [
        { name: "govind", salary: 29000, expenditure: 30000 },
        { name: "Ganesh", salary: 99000, expenditure: 69000 },
        { name: "akhil", salary: 69000, expenditure: 29000 },
        { name: "Aravind", salary: 59000, expenditure: 45000 },
    ]
    const dataInserted = await db.collection.insertMany(data);
    console.log(dataInserted);
    await db.client.close();
    /*
    '0': new ObjectId("641daf8da45e3b317fbb5d49"),
    '1': new ObjectId("641daf8da45e3b317fbb5d4a"),
    '2': new ObjectId("641daf8da45e3b317fbb5d4b"),
    '3': new ObjectId("641daf8da45e3b317fbb5d4c") 
    */
}

// insertData();

const findDataByExpr = async () => {
    const db = await databaseConnect("exprDemo");
    const query = {
        $expr: {
            $lt: ["$salary", "$expenditure"]
        }
    }
    var dataFound = await db.collection.find(query).toArray();
    console.log(dataFound);
    await db.client.close();
    /*
        [
            {
                _id: new ObjectId("641daf8da45e3b317fbb5d49"),
                name: 'govind',
                salary: 29000,
                expenditure: 30000
            }
        ]
    */
}

// findDataByExpr();

const findDataByExprWithCondition = async () => {
    const db = await databaseConnect("exprDemo");
    const data = [
        { name: "pen", quantity: 100, price: 10 },
        { name: "pencil", quantity: 200, price: 5 },
        { name: "Eraser", quantity: 50, price: 3 },
    ]

    let discountPrice = {
        $cond: {
            if: { $gt: ["$quantity", 100] },
            then: { $multiply: ["$price", 0.5] },
            else: { $multiply: ["$price", 0.75] }
        }
    }

    let query = {
        $expr: {
            $eq: [discountPrice, 2.5]
        }
    }

    var dataFound = await db.collection.find(query).toArray();
    console.log(dataFound);
    /*
        [
            {
                _id: new ObjectId("641dbaaa8c5d9f8587fb3277"),
                name: 'pencil',
                quantity: 200,
                price: 5
            }
        ]
    */
    await db.client.close();
}

// findDataByExprWithCondition();