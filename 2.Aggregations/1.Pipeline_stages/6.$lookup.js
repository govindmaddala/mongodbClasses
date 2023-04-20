const { ObjectId } = require('mongodb');
const { databaseConnect } = require('../../0.DatabaseConnection/databaseConnect');

const insertData = async () => {
    var db1 = await databaseConnect("aggregations", "lookupHabits");
    let friends = {
        childhood: ["sai", "ramesh", "madhu", "pavan", "ramu", "veerraju", "upendra"],
        school: ["kiran", "kalyan", "shanmukh", "sharat"],
        inter: ["aravind", "ganesh", "shankar", "uppu"],
        engineering: ["rajesh", "akhil", "gopi"],
        job: {
            jsw: ["shubham", "saurabh", "ashvani"],
            enmovil: ["rakesh", "sai ram", "ganesh", "Dinesh", "Oveek"]
        }
    }
    var frnd = await db1.collection.insertOne(friends);
    console.log("frnd", frnd);

    let jobs = {
        jobDetails: {
            job: [
                { company: "JSW STEELS", salary: 45000 },
                { company: "Enmovil", salary: 29000 },
            ]
        }
    }

    let db2 = await databaseConnect("aggregations", "lookupJobs")
    let job = await db2.collection.insertOne(jobs);
    console.log("job", job);

    var person = {
        name: "govind",
        city: "Anakapalle"
    }

    person.friends = frnd.insertedId;
    person.jobs = job.insertedId;

    let db3 = await databaseConnect("aggregations", "lookupperson")
    let per = await db3.collection.insertOne(person);
    console.log("per", per);
}

// insertData()

const lookup = async () => {
    let db = await databaseConnect("aggregations", "lookupperson")
    let pipeline = [
        {
            $lookup: {
                from: "lookupHabits",
                localField: "friends",
                foreignField: "_id",
                as: "friendList"
            }
        }, {
            $lookup: {
                from: "lookupJobs",
                localField: "jobs",
                foreignField: "_id",
                as: "jobList"
            }
        }
    ]
    let details = await db.collection.aggregate(pipeline).toArray();
    console.log(details[0].friendList);
    console.log(details[0].jobList);
}
lookup();