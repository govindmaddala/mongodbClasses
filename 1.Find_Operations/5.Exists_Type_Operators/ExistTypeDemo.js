const { databaseConnect } = require("./0.databaseConnect");

const insertData = async () => {
    const db = await databaseConnect("existsType");
    const data = [
        { name: "govind", age: 27 },
        { fullname: "manaswini vedula", age: "26" }
    ]
    const dataInserted = await db.collection.insertMany(data);
    console.log(dataInserted);
    await db.client.close();

    /*
    '0': new ObjectId("641c84aea21a1029025f0715"),
    '1': new ObjectId("641c84aea21a1029025f0716") 
    */
}

const existsDemo = async () => {
    const db = await databaseConnect("existsType");
    var dataFoundForNameTrue = await db.collection.find({name:{$exists:false}}).toArray()
    console.log("for name true",dataFoundForNameTrue);

    /*
    for name true [
        {
            _id: new ObjectId("641c84aea21a1029025f0715"),
            name: 'govind',
            age: 27
        }
    ]
    
    */

    var dataFoundForNameFalse = await db.collection.find({name:{$exists:false}}).toArray()
    console.log("for name false",dataFoundForNameFalse);
    await db.client.close();

    /*
    for name false [
        {
            _id: new ObjectId("641c84aea21a1029025f0716"),
            fullname: 'manaswini vedula',
            age: '26'
        }
    ]
    */
}

const typeDemo = async ()=>{
    const db = await databaseConnect("existsType");
    const intTypeData = await db.collection.find({age:{$type:"int"}}).toArray();
    console.log(intTypeData);
    /*
    for intTypeData   [
        {
            _id: new ObjectId("641c84aea21a1029025f0715"),
            name: 'govind',
            age: 27
        }
    ]
    */

    const numberTypeData = await db.collection.find({age:{$type:"number"}}).toArray();
    console.log(numberTypeData);
    /*
    for intTypeData   [
        {
            _id: new ObjectId("641c84aea21a1029025f0715"),
            name: 'govind',
            age: 27
        }
    ]
    */

    const stringTypeData = await db.collection.find({age:{$type:"string"}}).toArray();
    console.log(stringTypeData);

    /*
    stringTypeData = [
        {
            _id: new ObjectId("641c84aea21a1029025f0716"),
            fullname: 'manaswini vedula',
            age: '26'
        }
    ]
    */
    
    await db.client.close();
}

// insertData();
// existsDemo();
typeDemo();