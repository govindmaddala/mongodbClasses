/*
$skip
1) Skips over the specified number of documents that pass into the stage and 
    passes the remaining documents to the next stage in the pipeline.
2) syntax: { $skip: <positive 64-bit integer> }
3) $skip takes a positive integer that specifies the maximum number of documents to skip.
4) If $sort [aggregation stage], sort() and  findAndModify commands are using, be sure to include at least one field in your 
   sort that contains unique values, before passing results to the $skip stage.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")



var skipDemo = async () => {
    let db = await databaseConnect("aggregations", "skipDemo")
    let data = [
        { "_id": 1, "last_name": "Bernard", "first_name": "Emil", "year_born": 1868, "year_died": 1941, "nationality": "France" },
        { "_id": 2, "last_name": "Rippl-Ronai", "first_name": "Joszef", "year_born": 1861, "year_died": 1927, "nationality": "Hungary" },
        { "_id": 3, "last_name": "Ostroumova", "first_name": "Anna", "year_born": 1871, "year_died": 1955, "nationality": "Russia" },
        { "_id": 4, "last_name": "Van Gogh", "first_name": "Vincent", "year_born": 1853, "year_died": 1890, "nationality": "Holland" },
        { "_id": 5, "last_name": "Maurer", "first_name": "Alfred", "year_born": 1868, "year_died": 1932, "nationality": "USA" },
        { "_id": 6, "last_name": "Munch", "first_name": "Edvard", "year_born": 1863, "year_died": 1944, "nationality": "Norway" },
        { "_id": 7, "last_name": "Redon", "first_name": "Odilon", "year_born": 1840, "year_died": 1916, "nationality": "France" },
        { "_id": 8, "last_name": "Diriks", "first_name": "Edvard", "year_born": 1855, "year_died": 1930, "nationality": "Norway" }
    ]
    // await db.collection.drop();
    // var resp = await db.collection.insertMany(data);
    // console.log(resp);
    let pipeline = [
        { $match: { "year_born": { $gt: 1860 } } },
        { $skip: 2 }
    ]
    let dataResp = await db.collection.aggregate(pipeline).toArray();
    console.log("dataresp", dataResp.length);
    await db.client.close();
}
// skipDemo();

/*

$sort
1) Sorts all input documents and returns them to the pipeline in sorted order.
2) The $sort stage has the following prototype form: { $sort: { <field1>: <sort order>, <field2>: <sort order> ... } }
3) $sort takes a document that specifies the field(s) to sort by and the respective sort order. 
4) <sort order> can have one of the following values:
    --> 1   : sort ascending
    --> -1  : sort descending
5) Limits : You can sort on a maximum of 32 keys.
*/

const sortDemo = async () => {
    let db = await databaseConnect("aggregations", "skipDemo")
    let pipeline = [
        {
            $sort:{"year_born":-1}
        }
    ]
    let dataResp = await db.collection.aggregate(pipeline).toArray();
    console.log("sort", dataResp);
    await db.client.close();
}

sortDemo();
