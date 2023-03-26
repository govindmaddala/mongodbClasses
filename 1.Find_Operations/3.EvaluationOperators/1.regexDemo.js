const { databaseConnect } = require("../0.databaseConnect");

const insertData = async () => {
    const db = await databaseConnect("regexDemo");
    const data = [
        { name: "govind", age: 27 },
        { name: "Ganesh", age: 27 },
        { name: "akhil", age: 27 },
        { name: "Aravind", age: 27 },
    ]
    const dataInserted = await db.collection.insertMany(data);
    console.log(dataInserted);
    await db.client.close();
    /*
    '0': new ObjectId("641dacc8b469f926a0b9e037"),
    '1': new ObjectId("641dacc8b469f926a0b9e038"),
    '2': new ObjectId("641dacc8b469f926a0b9e039"),
    '3': new ObjectId("641dacc8b469f926a0b9e03a")   
    */
}

// insertData();

const findDataWithCommonWords = async ()=>{
    const db = await databaseConnect("regexDemo");
    const query = {
        name:{
            $regex:/vind/
        }
    }
    const dataFound = await db.collection.find(query).toArray();
    console.log(dataFound);
    await db.client.close();
    /*
            [
        {
            _id: new ObjectId("641dacc8b469f926a0b9e037"),
            name: 'govind',
            age: 27
        },
        {
            _id: new ObjectId("641dacc8b469f926a0b9e03a"),
            name: 'Aravind',
            age: 27
        }
        ]   
*/
}

// findDataWithCommonWords()

const findDataWithIgnoringCase = async ()=>{
    const db = await databaseConnect("regexDemo");
    const query = {
        name:{
            $regex:/g/i
        }
    }
    const dataFound = await db.collection.find(query).toArray();
    console.log(dataFound);
    await db.client.close();
    /*
    [
        {
            _id: new ObjectId("641dacc8b469f926a0b9e037"),
            name: 'govind',
            age: 27
        },
        {
            _id: new ObjectId("641dacc8b469f926a0b9e038"),
            name: 'Ganesh',
            age: 27
        }
    ]
    */
}

findDataWithIgnoringCase();