const { databaseConnect } = require("../../0.DatabaseConnection/0.databaseConnect");

const insertData = async () => {
    const db = await databaseConnect("embeddedDocx");
    const data = [
        {
            results: [
                { subject: "Maths", score: 100 },
                { subject: "Science", score: 95 },
            ]
        },
        {
            results: [
                { subject: "Maths", score: 95 },
                { subject: "Science", score: 100 },
            ]
        },
        {
            results: [
                { subject: "Maths", score: 75 },
                { subject: "Science", score: 85 },
            ]
        },

    ]

    const insertedData = await db.collection.insertMany(data);
    console.log(insertedData);
    await db.client.close();
}

// insertData();

const findMathsAnd100Marks_NormalWay = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        "results.subject": "Maths",
        "results.score": 100,
    };
    const foundData = await db.collection.find(query).toArray();
    for(let each of foundData){
        console.log(each.results);
    }
    /*
        [ { subject: 'Maths', score: 100 }, { subject: 'Science', score: 95 } ]
        [ { subject: 'Maths', score: 95 }, { subject: 'Science', score: 100 } ]
    */
    // *  await db.client.close();
}
// findMathsAnd100Marks_NormalWay();
const findMathsWith100Marks_$elemMatch = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        results:{$elemMatch:{subject:"Maths",score:100}}
    }
    const foundData = await db.collection.find(query).toArray();
    for(let each of foundData){
        console.log(each.results);
    }
    /*
        [ { subject: 'Maths', score: 100 }, { subject: 'Science', score: 95 } ]
    */
    await db.client.close();
}

findMathsWith100Marks_$elemMatch();