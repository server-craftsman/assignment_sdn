import mongoose, { Schema } from 'mongoose';
import { COLLECTION_NAME } from '../../core/constants';
import { UserRoles } from './user.constant';
import { UserRoleEnum } from './user.enum';
import { IUser } from './user.interface';

const UserSchemaEntity: Schema<IUser> = new Schema({
    // _id: { type: String },
    email: { type: String, unique: true, index: true, required: true },
    password: { type: String },
    name: { type: String, required: true },
    role: {
        type: String,
        enum: UserRoles,
        default: UserRoleEnum.STUDENT,
        required: true,
    },
    description: { type: String },
    phone_number: { type: String },
    avatar_url: { type: String },
    dob: { type: Date, default: Date.now },
    // token: { type: String, default: '' },
    // token_expires: { type: Date, default: Date.now() + 1000 * 60 * 60 * 24 * 30 },
    token_version: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const UserSchema = mongoose.model<IUser & mongoose.Document>(COLLECTION_NAME.USER, UserSchemaEntity);
export default UserSchema;
