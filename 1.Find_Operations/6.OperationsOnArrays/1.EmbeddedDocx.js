const { databaseConnect } = require("../../0.DatabaseConnection/0.databaseConnect");

const insertData = async () => {
    const db = await databaseConnect("embeddedDocx");
    const data = [
        {
            name: "Govind Maddala",
            jobs: [
                { comp1: "JSW", salary: 45000 },
                { comp1: "Enmovil", salary: 28600 },
            ],
            hobbies: [
                "cooking", "reading", "coding"
            ]
        },
        {
            name: "Akhil Koduri",
            jobs: [
                { comp1: "Vedanta", salary: 85000 },
                { comp1: "Deloitee", salary: 50000 },
            ],
            hobbies: [
                "chatting", "reading", "coding"
            ]
        },
        {
            name: "Akhil Nagumalle",
            jobs: [
                { comp1: "JSW", salary: 60000 }
            ],
            hobbies: [
                ["sleeping", "eating"], "reading", ["talking"]
            ]
        }
    ]
    const dataInserted = await db.collection.insertMany(data);
    console.log(dataInserted);
    await db.client.close();
}

// insertData();

const findPersonsWorkedInJSW = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        "jobs.comp1": "JSW"
    }
    const dataFound = await db.collection.find(query).toArray();
    console.log(dataFound); // ==> return data for Govind and AKhil Nagumalle
    await db.client.close();
}

// findPersonsWorkedInJSW();

const findPersonsWorkingInJSWWithSalaryMoreThan50000 = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        "jobs.comp1": "JSW",
        "jobs.salary":{$gt:50000}
    }
    const dataFound = await db.collection.find(query).toArray();
    console.log(dataFound); // ==> return data for AKhil Nagumalle
    await db.client.close();
}

findPersonsWorkingInJSWWithSalaryMoreThan50000();