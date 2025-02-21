import { Document, Types } from "mongoose";

export interface IProduct extends Document {
    name: string | null; //required
    description?: string; //optional
    category_id: string | null; //required - reference to category
    price: number | null; //required
    discount?: number; //optional
    image_url?: string | undefined; //optional
    user_id?: string; //optional
    createdAt?: Date;
    updatedAt?: Date;
}