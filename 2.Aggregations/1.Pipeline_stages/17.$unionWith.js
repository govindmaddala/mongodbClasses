/*
$unionWith:
1) Performs a union of two collections
2) combines pipeline results from two collections into a single result set. 
3) outputs the combined result set (including duplicates) to the next stage.
4) The order in which the combined result set documents are output is unspecified.
5) Syntax: { $unionWith: { coll: "<collection>", pipeline: [ <stage1>, ... ] } }
   --> To include all documents from the specified collection without any processing, you can use the simplified form:
            { $unionWith: "<collection>" } 
6) The combined results from the previous stage and the $unionWith stage can include duplicates.

*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const unionWithDemo = async () => {
   let db1 = await databaseConnect("aggregation", "unionWithDemoColl1");
   let db2 = await databaseConnect("aggregation", "unionWithDemoColl2");
   let data1 = [
      { _id: 1, supplier: "Aardvark and Sons", state: "Texas" },
      { _id: 2, supplier: "Bears Run Amok.", state: "Colorado" },
      { _id: 3, supplier: "Squid Mark Inc. ", state: "Rhode Island" },
   ]

   let data2 = [
      { _id: 1, warehouse: "A", region: "West", state: "California" },
      { _id: 2, warehouse: "B", region: "Central", state: "Colorado" },
      { _id: 3, warehouse: "C", region: "East", state: "Florida" },
   ]

   // let resp1 = await db1.collection.insertMany(data1);
   // let resp2 = await db2.collection.insertMany(data2);
   // console.log("resp1",resp1);
   // console.log("resp2",resp2);

   let pipeline = [
      {
         $project: { state: 1, _id: 0 }
      },
      {
         $unionWith: {
            coll: "unionWithDemoColl2",
            pipeline: [{
               $project: { state: 1, _id: 0 }
            }]
         }
      },
      {
         $group:{   //==> removes duplicates
            _id:"$state"
         }
      }
   ]

   let dataResp = await db1.collection.aggregate(pipeline).toArray();
   console.log("dataResp", dataResp);
   await db1.client.close()
}

unionWithDemo();