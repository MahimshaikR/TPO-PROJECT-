const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000
      });
      isMongoConnected = true;
      console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
      return true;
    } catch (err) {
      console.warn(`[Database] MongoDB connection failed (${err.message}).`);
      console.log(`[Database] Activating High-Performance Dynamic Document Engine.`);
      isMongoConnected = false;
      return false;
    }
  } else {
    console.log(`[Database] No MONGODB_URI configured. Running on High-Performance Dynamic Document Engine.`);
    isMongoConnected = false;
    return false;
  }
};

const getStatus = () => {
  return {
    isMongoConnected,
    type: isMongoConnected ? 'MongoDB Atlas' : 'Embedded Dynamic Engine',
    status: 'OPERATIONAL'
  };
};

module.exports = {
  connectDB,
  getStatus,
  isUsingMongo: () => isMongoConnected
};
