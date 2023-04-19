/*

Categorizes incoming documents into groups, called buckets, based on a specified expression and bucket boundaries and outputs a document per each bucket. Each output document contains an _id field whose value specifies the inclusive lower bound of the bucket. The output option specifies the fields included in each output document.

$bucket  only produces output documents for buckets that contain at least one input document.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

var data = [
    { "_id": 1, "last_name": "Bernard", "first_name": "Emil", "year_born": 1868, "year_died": 1941, "nationality": "France" },
    { "_id": 2, "last_name": "Rippl-Ronai", "first_name": "Joszef", "year_born": 1861, "year_died": 1927, "nationality": "Hungary" },
    { "_id": 3, "last_name": "Ostroumova", "first_name": "Anna", "year_born": 1871, "year_died": 1955, "nationality": "Russia" },
    { "_id": 4, "last_name": "Van Gogh", "first_name": "Vincent", "year_born": 1853, "year_died": 1890, "nationality": "Holland" },
    { "_id": 5, "last_name": "Maurer", "first_name": "Alfred", "year_born": 1868, "year_died": 1932, "nationality": "USA" },
    { "_id": 6, "last_name": "Munch", "first_name": "Edvard", "year_born": 1863, "year_died": 1944, "nationality": "Norway" },
    { "_id": 7, "last_name": "Redon", "first_name": "Odilon", "year_born": 1840, "year_died": 1916, "nationality": "France" },
    { "_id": 8, "last_name": "Diriks", "first_name": "Edvard", "year_born": 1855, "year_died": 1930, "nationality": "Norway" }
]

var insertData = async () => {
    let db = await databaseConnect("aggregations", "bucket")
    await db.collection.drop();
    var resp = await db.collection.insertMany(data);
    console.log(resp);
    await db.client.close();
}
// insertData();

var bucket = async () => {
    let db = await databaseConnect("aggregations", "bucket")
    let pipeline = [
        {
            $bucket: {
                groupBy: "$year_born",                        // Field to group by
                boundaries: [1840, 1850, 1860, 1870, 1880], // Boundaries for the buckets
                default: "Other",                             // Bucket ID for documents which do not fall into a bucket
                output: {                                     // Output for each bucket
                    "count": { $sum: 1 },
                    "artists":
                    {
                        $push: {
                            "name": { $concat: ["$first_name", " ", "$last_name"] },
                            "year_born": "$year_born"
                        }
                    }
                }
            }
        },
        {
            $project: { artists: 1 }
        }
    ]

    var resp = await db.collection.aggregate(pipeline).toArray();
    console.log(resp);
}

bucket();