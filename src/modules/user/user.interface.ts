import { Document } from 'mongoose';
import { UserRoleEnum } from './user.enum';

export type UserRole = UserRoleEnum.ADMIN | UserRoleEnum.INSTRUCTOR | UserRoleEnum.STUDENT | UserRoleEnum.ALL;

export interface IUser extends Document {
    _id: string;
    name: string; // required
    email: string; // unique
    password?: string; // required if google_id is null or empty
    role: UserRole; // default is "student"
    description?: string; // required if role is instructor
    phone_number?: string; // default empty
    avatar_url?: string; // url
    dob?: Date; // date of birth, default new Date()

    // check verify
    // is_verified?: boolean; // default false,
    // token?: string; // default uuidv4()
    // token_expires?: Date; // default new Date()
    token_version: number; // default 0

    created_at?: Date; // default new Date()
    updated_at?: Date; // default new Date()
}