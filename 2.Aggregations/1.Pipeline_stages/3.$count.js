const { databaseConnect } = require('../../0.DatabaseConnection/databaseConnect');

var countDemo = async () => {
    var data = [{
        fname: "maddala",
        middlename: "Jai",
        lname: "Shankar"
    },
    {
        fname: "maddala",
        middlename: "veera nooka",
        lname: "Govind"
    }]
    let db = await databaseConnect("concat", "con");

    let fullName = await db.collection.aggregate([
        {
            $match: {
                fname: "maddala"
            }
        },
        {
            $count: "length"
        }
    ]).toArray();
    console.log(fullName);
}

countDemo();