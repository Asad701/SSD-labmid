import mongoose from "mongoose";



const DbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    // await mongoose.connect(process.env.MONGO_URI, {
    //   useUnifiedTopology: true,
    // });
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed");
  }
};

export default DbConnect;
