import { Document } from 'mongoose';
import { IProduct } from '../product/product.interface';

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  count: number;
  products: IProduct[];
}