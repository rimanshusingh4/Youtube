import mongoose from "mongoose"; //jb v database se kuch kaam hoga tb hum mongoose use krte hai.
import { DB_Name } from "../constants.js";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log(`\n🎉 mongoDB Connected!! Database HOST.. ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
        process.exit(1);
    }
}

export default connectDB; 