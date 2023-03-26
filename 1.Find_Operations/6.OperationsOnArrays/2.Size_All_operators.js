const { databaseConnect } = require("../../0.DatabaseConnection/0.databaseConnect");
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

const findPersonsWorkedInOneCompanyOnly = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        jobs: { $size: 1 }
    }
    const dataFound = await db.collection.find(query).toArray();
    console.log(dataFound); // ==> return data for AKhil Nagumalle
    await db.client.close();
}

// findPersonsWorkedInOneCompanyOnly();

const findHobbiesAsReadingAndCoding = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        hobbies: { $all: ["reading", "coding"] },
    }
    const dataFound = await db.collection.find(query).toArray();
    console.log(dataFound); // ==> return data for AKhil Koduri and Govind Maddala
    await db.client.close();
}
// findHobbiesAsReadingAndCoding();

const alternativeForAllUsingAndLogicalOperator = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = { $and: [{ hobbies: "reading" }, { hobbies: "coding" }] }

    const dataFound = await db.collection.find(query).toArray();
    console.log(dataFound); // ==> return data for AKhil Koduri and Govind Maddala
    await db.client.close();
}

alternativeForAllUsingAndLogicalOperator();

const findHobbiesInEmbeddedArrays = async () => {
    const db = await databaseConnect("embeddedDocx");
    const query = {
        hobbies: { $all: [["sleeping", "eating"]] }, // ==> elements should exactly equals to array else empty array will be returned
    }
    const dataFound = await db.collection.find(query).toArray();
    console.log(dataFound); // ==> return data for AKhil Nagumalle
    await db.client.close();
}
// findHobbiesInEmbeddedArrays();