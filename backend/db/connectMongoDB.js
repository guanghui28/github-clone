import mongoose from "mongoose";

const connectMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connect MongoDB successfully!");
	} catch (error) {
		console.log("Error in connectMongoDB ", error.message);
	}
};

export default connectMongoDB;
