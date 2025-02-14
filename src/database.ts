import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "./core/utils";

dotenv.config();

const connectDB = async () => {
    const mongoDbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';
    if (!mongoDbUri) {
        logger.error('MongoDb URI is empty!');
        return;
    }
    mongoose.connect(mongoDbUri).catch((error) => {
        logger.error('Connection to database error: ' + error);
    });
    logger.info('Connection to database success!');
};

export default connectDB;