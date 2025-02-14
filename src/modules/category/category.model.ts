import mongoose from 'mongoose';
import { ICategory } from './category.interface';
import { COLLECTION_NAME } from '../../core/constants';

const CategorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: COLLECTION_NAME.PRODUCT,
    default: []
  }
}, {
  timestamps: true
});

export const Category = mongoose.model<ICategory & mongoose.Document>(COLLECTION_NAME.CATEGORY, CategorySchema);