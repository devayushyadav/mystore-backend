import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL ||
        `mongodb+srv://ayushyadav:m9dIGOeTbQd2lIbT@cluster0.vih3e.mongodb.net/mystore?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error: ", err);
    throw err;
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error: ", err);
  });
};

export default connectDB;
