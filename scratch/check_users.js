const mongoose = require('mongoose');

const MONGO_URI = "mongodb://ADMIN:asad123ADMIN@ac-gkdi2ze-shard-00-00.6malrfw.mongodb.net:27017,ac-gkdi2ze-shard-00-01.6malrfw.mongodb.net:27017,ac-gkdi2ze-shard-00-02.6malrfw.mongodb.net:27017/royalfold?ssl=true&authSource=admin&retryWrites=true&w=majority";

async function checkUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    
    // We don't have the model here so we use the collection directly
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    console.log("Users found:", users.length);
    users.forEach(u => {
      console.log(`- ID: ${u.userid}, Email: ${u.email}, Name: ${u.fname} ${u.lname}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkUsers();
