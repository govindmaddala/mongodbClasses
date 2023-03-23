const { databaseConnect } = require("../0.databaseConnect");


const insertData = async () => {
    var coll = await databaseConnect("embeddedDocumentsCollection");
    var data = [
        {
            name: "govind",
            companies: [
                { comp: "JSW", salary: 45000, experience: 2 },
                { comp: "Enmovil", salary: 30000, experience: 1 }
            ],
            hobbies: ['cooking', 'workouts', 'coding']
        },
        {
            name: "Rajesh",
            companies: [
                { comp: "Capgemini", salary: 65000, experience: 2 },
                { comp: "Reddys", salary: 80000, experience: 3 }
            ],
            hobbies: ['cooking', 'cricket', 'coding']
        },
        {
            name: "Akhil",
            companies: [
                { comp: "Vedanta", salary: 95000, experience: 2 },
                { comp: "Deloite", salary: 80000, experience: 1 }
            ],
            hobbies: ['chatting', 'workouts', 'coding']
        }
    ]

    var inserted = await coll.insertMany(data);
    return inserted;
    // console.log(inserted);
    /*

    insertedIds: {
    '0': new ObjectId("64120046f4519f86ee173353"),
    '1': new ObjectId("64120046f4519f86ee173354"),
    '2': new ObjectId("64120046f4519f86ee173355")
  }

    */
}
// insertData().then((resp) => {
//     console.log(resp);
// })

const embeddedDocxQuery = async () => {
    var coll = await databaseConnect("embeddedDocumentsCollection");
    var dataFound1 = await coll.find({"companies.comp":"JSW"}).toArray();
    /*
    [
        { comp: 'JSW', salary: 45000, experience: 2 },
        { comp: 'Enmovil', salary: 30000, experience: 1 }
    ]
    */
    var dataFound2 = await coll.find({"companies.comp":"JSW","companies.salary":{$gte:45000}}).toArray();
    /*
    [
        { comp: 'JSW', salary: 45000, experience: 2 },
        { comp: 'Enmovil', salary: 30000, experience: 1 }
    ]
    */
    return {
        dataFound1,
        dataFound2
    }
}

embeddedDocxQuery().then((resp)=>{
    console.log(resp);

})



