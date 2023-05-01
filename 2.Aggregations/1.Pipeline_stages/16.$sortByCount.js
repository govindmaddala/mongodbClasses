/*
$sortByCount
1) Groups incoming documents based on the value of a specified expression, then computes the count of documents in each distinct group.
2) Each output document contains two fields:
    --> _id field containing the distinct grouping value
    --> count field containing the number of documents belonging to that grouping or category.
3) The documents are sorted by count in descending order.
4) Syntax: { $sortByCount:  <expression> }
*/

const { databaseConnect } = require("../../0.DatabaseConnection/databaseConnect")

const sortByCount = async () => {
    let db = await databaseConnect("aggregations", "sortByCount");
    let data = [
        { "_id": 1, "title": "The Pillars of Society", "artist": "Grosz", "year": 1926, "tags": ["painting", "satire", "Expressionism", "caricature"] },
        { "_id": 2, "title": "Melancholy III", "artist": "Munch", "year": 1902, "tags": ["woodcut", "Expressionism"] },
        { "_id": 3, "title": "Dancer", "artist": "Miro", "year": 1925, "tags": ["oil", "Surrealism", "painting"] },
        { "_id": 4, "title": "The Great Wave off Kanagawa", "artist": "Hokusai", "tags": ["woodblock", "ukiyo-e"] },
        { "_id": 5, "title": "The Persistence of Memory", "artist": "Dali", "year": 1931, "tags": ["Surrealism", "painting", "oil"] },
        { "_id": 6, "title": "Composition VII", "artist": "Kandinsky", "year": 1913, "tags": ["oil", "painting", "abstract"] },
        { "_id": 7, "title": "The Scream", "artist": "Munch", "year": 1893, "tags": ["Expressionism", "painting", "oil"] },
        { "_id": 8, "title": "Blue Flower", "artist": "O'Keefe", "year": 1918, "tags": ["abstract", "painting"] }
    ]
    // let insertResp = await db.collection.insertMany(data);
    // console.log("insertResp",insertResp);
    
    let pipeline = [
        {
            $unwind:"$tags"
        },
        {
            $sortByCount:"$tags"
        }
    ]
    let resp = await db.collection.aggregate(pipeline).toArray();
    console.log("resp",resp);
    await db.client.close();
}

sortByCount();