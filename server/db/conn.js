const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db);

let _db;
 
module.exports = {
  connectToServer: async function () {
    try {
      await client.connect();
      _db = client.db("employees");
      console.log("Successfully connected to MongoDB.");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  },
 
  getDb: function () {
    return _db;
  },
};