import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "./core/utils";
import { UserSchema } from "./modules/user";
import { UserRoleEnum } from "./modules/user/user.enum";
import { encodePasswordUserNormal } from "./core/utils";
dotenv.config();

const connectDB = async () => {
    const mongoDbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';
    if (!mongoDbUri) {
        logger.error('MongoDb URI is empty!');
        return;
    }
    const userSchema = new UserSchema();
    try {
        await mongoose.connect(mongoDbUri);
        logger.info('Connection to database success!');

        // Check if any users exist in the database
        const User = mongoose.model('User', userSchema.schema);
        const userCount = await User.countDocuments();
        
        // If no users exist, create a default admin user
        if (userCount === 0) {
            const hashedPassword = await encodePasswordUserNormal('12345');
            const defaultUser = new User({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: UserRoleEnum.ADMIN,
                description: "Huy is a good boy",
                phone_number: '0869872830',
                avatar_url: 'ahihi',
                token_version: 0
            });
            await defaultUser.save();
            logger.info('Default admin user created successfully');
        }
    } catch (error) {
        logger.error('Connection to database error: ' + error);
    }
};

export default connectDB;