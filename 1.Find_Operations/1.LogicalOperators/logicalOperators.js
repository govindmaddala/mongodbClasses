const { databaseConnect } = require("../../0.DatabaseConnection/0.databaseConnect");

const insertData = async () => {
  const db = await databaseConnect("logicalOperators");
  const data = [
    { name: "govind", sname: "maddala" },
    { name: "jaya shakar", sname: "maddala" },
    { name: "akhil", sname: "nagumalle" },
    { name: "ganesh", sname: "nagumalle" },
    { name: "akhil", sname: "koduri" },
  ]
  const insertedData = await db.collection.insertMany(data);
  console.log(insertedData);
  await db.client.close();

  /*
  '0': new ObjectId("641c6997e9336df300596ad5"),
  '1': new ObjectId("641c6997e9336df300596ad6"),
  '2': new ObjectId("641c6997e9336df300596ad7"),
  '3': new ObjectId("641c6997e9336df300596ad8"),
  '4': new ObjectId("641c6997e9336df300596ad9") 
  */
}

const orOperator = async () => {
  const db = await databaseConnect("logicalOperators");
  const query = {
    $or: [
      { name: "govind" }, { sname: "maddala" }
    ]
  }
  const data = await db.collection.find(query).toArray();
  console.log(data);
  /*
  [  {
  _id: new ObjectId("641c6997e9336df300596ad5"),
  name: 'govind',
  sname: 'maddala'
},
{
  _id: new ObjectId("641c6997e9336df300596ad6"),
  name: 'jaya shakar',
  sname: 'maddala'
}]
  */
}

const andOperator = async () => {
  const db = await databaseConnect("logicalOperators");
  const query = {
    $and: [
      { name: "govind" }, { sname: "maddala" }
    ]
  }
  const data = await db.collection.find(query).toArray();
  console.log(data);
  await db.client.close();
  /*
  [  {
  _id: new ObjectId("641c6997e9336df300596ad5"),
  name: 'govind',
  sname: 'maddala'
}]
  */
}

const andInAnotherWay = async () => {
  const db = await databaseConnect("logicalOperators");
  const query = { name: "govind", sname: "maddala" }
  const data = await db.collection.find(query).toArray();
  console.log(data);
  /*
  [  {
  _id: new ObjectId("641c6997e9336df300596ad5"),
  name: 'govind',
  sname: 'maddala'
  }]
  */
  await db.client.close();
}

const andInActualUsuage = async () => {
  const db = await databaseConnect("logicalOperators");
  const data = [
    { name: "govind", age: 27 },
    { name: "ram", age: 47 },
    { name: "syam", age: 37 },
    { name: "ganesh", age: 17 },
    { name: "akhil", age: 57 },
  ]
  // const dataInserted = await db.collection.insertMany(data);
  // console.log(dataInserted);
  /*
  '0': new ObjectId("64204cf6f1e6e029b3d88ec9"),
    '1': new ObjectId("64204cf6f1e6e029b3d88eca"),
    '2': new ObjectId("64204cf6f1e6e029b3d88ecb"),
    '3': new ObjectId("64204cf6f1e6e029b3d88ecc"),
    '4': new ObjectId("64204cf6f1e6e029b3d88ecd")
  */
  const query = {
    $and: [{ age: { $gte: 27 } }, { age: { $lte: 30 } }]
  }

  const dataFound = await db.collection.find(query).toArray();
  console.log(dataFound); // ==> return data of govind since his age is in between 27 and 30
  await db.client.close();
}

const norOperator = async () => {
  const db = await databaseConnect("logicalOperators");
  const query = {
    $nor: [
      { name: "ganesh" }, { sname: "nagumalle" }
    ]
  }
  const data = await db.collection.find(query).toArray();
  console.log(data);
  /*
  [  {
  _id: new ObjectId("641c6997e9336df300596ad5"),
  name: 'govind',
  sname: 'maddala'
  },
  {
  _id: new ObjectId("641c6997e9336df300596ad6"),
  name: 'jaya shakar',
  sname: 'maddala'
},
{
  _id: new ObjectId("641c6997e9336df300596ad9"),
  name: 'akhil',
  sname: 'koduri'
}]
  */
  await db.client.close();
}

const notOperator = async () => {
  const db = await databaseConnect("logicalOperators");

  var query = {
    sname: { $not: { $eq: "maddala" } }
  }
  const data = await db.collection.find(query).toArray();
  console.log(data);
  /*
  [
{
  _id: new ObjectId("641c6997e9336df300596ad7"),
  name: 'akhil',
  sname: 'nagumalle'
},
{
  _id: new ObjectId("641c6997e9336df300596ad8"),
  name: 'ganesh',
  sname: 'nagumalle'
},
{
  _id: new ObjectId("641c6997e9336df300596ad9"),
  name: 'akhil',
  sname: 'koduri'
}
]
  */
  await db.client.close();
}

const notOperatorInAnotherWay = async () => {
  const db = await databaseConnect("logicalOperators");

  var query = {
    sname: { $ne: "maddala" }
  }
  const data = await db.collection.find(query).toArray();
  console.log(data);
  /*
  [
{
  _id: new ObjectId("641c6997e9336df300596ad7"),
  name: 'akhil',
  sname: 'nagumalle'
},
{
  _id: new ObjectId("641c6997e9336df300596ad8"),
  name: 'ganesh',
  sname: 'nagumalle'
},
{
  _id: new ObjectId("641c6997e9336df300596ad9"),
  name: 'akhil',
  sname: 'koduri'
}
]
  */
  await db.client.close();
}

// insertData();
// orOperator();
// andOperator();
// andInAnotherWay()
andInActualUsuage()
// norOperator()
// notOperator();
// notOperatorInAnotherWay()