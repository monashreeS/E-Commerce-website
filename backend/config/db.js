


const connectDB = async () => {
  const uri = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;
  if (!uri) throw new Error('MONGO_URL not set');
  await mongoose.connect(uri, { dbName });
  console.log(`[db] Connected to MongoDB (${dbName})`);
};

module.exports = connectDB;
