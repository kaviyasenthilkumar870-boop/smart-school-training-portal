const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_school';

  try {
    // Attempt connection with 2.5 second timeout so it fails quickly if local mongod is not started
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    isConnected = true;
    console.log(`[Database] ✅ Connected to MongoDB successfully at: ${uri}`);
  } catch (err) {
    isConnected = false;
    console.log(`[Database] ⚠️ Notice: MongoDB service not running at "${uri}".`);
    console.log(`[Database] 💾 Enabling automatic persistent on-disk data storage at "backend/data/db.json".`);
    console.log(`[Database] ℹ️ All created schools, users, events, registrations & attendance will persist across refreshes!`);
    console.log(`[Database] ℹ️ To switch to MongoDB Atlas or local MongoDB, start mongod or configure MONGODB_URI in backend/.env.`);
  }

  return isConnected;
}

function getIsConnected() {
  return isConnected;
}

module.exports = {
  connectDB,
  getIsConnected
};
