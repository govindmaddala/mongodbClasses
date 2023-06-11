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
// lookup();

const lookupDemo = async () => {
    let names = [
        {
            _id: 1,
            name: "Govind Maddala",
            colg_id: 11,
            loc_id: 444
        },
        {
            _id: 2,
            name: "Akhil Koduri",
            colg_id: 11,
            loc_id: 111
        },
        {
            _id: 3,
            name: "Akhil Nagulamalli",
            colg_id: 22,
            loc_id: 222
        },
        {
            _id: 4,
            name: "Ganesh Nagulamalli",
            colg_id: 55,
            loc_id: 555
        },
        {
            _id: 5,
            name: "Ganesh Geddada",
            colg_id: 44,
            loc_id: 333
        },
        {
            _id: 6,
            name: "Rajesh Kavuru",
            colg_id: 11,
            loc_id: 111
        },
        {
            _id: 7,
            name: "Rajesh Alla",
            colg_id: 33,
            loc_id: 444
        },
        {
            _id: 8,
            name: "Ashvani Kumar",
            colg_id: 22,
            loc_id: 222
        },
    ]

    let colg = [
        {
            _id: 11,
            colgName: "NIT Raipur"
        },
        {
            _id: 22,
            colgName: "NIT Jamshedpur"
        },
        {
            _id: 33,
            colgName: "Simhadri Colg"
        },
        {
            _id: 44,
            colgName: "Bapatla Colg"
        },
        {
            _id: 55,
            colgName: "Aditya Colg"
        }
    ]

    let howConnected = [
        {
            _id: 111,
            loc: "Engg"
        },
        {
            _id: 222,
            loc: "JSW"
        },
        {
            _id: 333,
            loc: "Enmovil"
        },
        {
            _id: 444,
            loc: "Life"
        },
        {
            _id: 555,
            loc: "Inter"
        },
    ]

    let db1 = await databaseConnect("aggregations", "names");
    let db2 = await databaseConnect("aggregations", "colg");
    let db3 = await databaseConnect("aggregations", "howConnected");
    // await db1.collection.insertMany(names);
    // await db2.collection.insertMany(colg);
    // await db3.collection.insertMany(howConnected);

    let pipeline = [
        {
            $match: { name: "Govind Maddala" }
        },
        {
            $lookup: {
                from: "colg",
                localField: "colg_id",
                foreignField: "_id",
                as: "collegeName"
            }
        },
        {
            $lookup: {
                from: "howConnected",
                localField: "loc_id",
                foreignField: "_id",
                as: "howConnected"
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                howConnected: 1,
                collegeName: 1
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        {
                            name: "$name",
                            howConnected: { $arrayElemAt: ["$howConnected.loc", 0] },
                            collegeName: { $arrayElemAt: ["$collegeName.colgName", 0] }
                        },
                    ]
                }
            }
        }
    ]

    let lookupResp = await db1.collection.aggregate(pipeline).toArray();
    console.log("lookupResp", lookupResp[0]);
    await db1.client.close();
    await db2.client.close();
    await db3.client.close();
}

lookupDemo();