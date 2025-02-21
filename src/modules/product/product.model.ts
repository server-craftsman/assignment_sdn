import mongoose, {Schema} from "mongoose";
import { IProduct } from "./product.interface";
import { COLLECTION_NAME } from "../../core/constants/collection.constant";

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    category_id: { type: Schema.Types.ObjectId, required: true, ref: COLLECTION_NAME.CATEGORY},
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    image_url: { type: String, default: 'https://via.placeholder.com/150' },
    user_id: { type: String, ref: COLLECTION_NAME.USER, default: null },
}, { timestamps: true });

//debug
export const Product = mongoose.model<IProduct & mongoose.Document>(COLLECTION_NAME.PRODUCT, ProductSchema);