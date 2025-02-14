import { Category } from './category.model';
import { ICategory } from './category.interface';
import { CreateCategoryDto } from './dtos/create.dto';
import { UpdateCategoryDto } from './dtos/update.dto';
import { HttpStatus } from '../../core/enums';
import { HttpException } from '../../core/exceptions';
import { isEmptyObject, checkValidUrl } from '../../core/utils';
import { IError } from '../../core/interfaces';
import { Product } from '../product/product.model';

export default class CategoryService {
  public categorySchema = Category;
  public productSchema = Product;

  public create = async (createCategoryDto: CreateCategoryDto): Promise<ICategory> => {
    try {
      if (isEmptyObject(createCategoryDto)) {
        throw new HttpException(HttpStatus.BAD_REQUEST, 'Category name is required');
      }

      const errorResults: IError[] = [];

      //check name is duplicated
      const existingCategory = await this.categorySchema.findOne({ name: createCategoryDto.name });
      if (existingCategory) {
        errorResults.push({ field: 'name', message: 'Category name already exists' });
      }

      //check name is valid
      if (createCategoryDto.name.length < 2) {
        errorResults.push({ field: 'name', message: 'Category name must be at least 2 characters long' });
      }

      //check description is valid
      if (createCategoryDto.description && createCategoryDto.description.length < 2) {
        errorResults.push({ field: 'description', message: 'Category description must be at least 2 characters long' });
      }
      
      if (errorResults.length) {
        throw new HttpException(HttpStatus.BAD_REQUEST, 'Validation failed', errorResults);
      }

      const category = await this.categorySchema.create(createCategoryDto);
      if(!category) {
        throw new HttpException(HttpStatus.ACCEPTED, 'Category not created');
      }
      return category;
    } catch (error: any) {
      throw new HttpException(HttpStatus.SERVER_ERROR, `Failed to create category: ${error.message}`, error.errors);
    }
  };

  public getItems = async (): Promise<ICategory[]> => {
    try {
      const categories = await this.categorySchema.find();
      return categories;
    } catch (error: any) {
      throw new HttpException(HttpStatus.SERVER_ERROR, `Failed to find categories: ${error.message}`, error.errors);
    }
  };

  public getItemById = async (id: string): Promise<ICategory | null> => {
    try {
      const category = await this.categorySchema.findOne({ _id: id });
      if (!category) {
        throw new HttpException(HttpStatus.NOT_FOUND, 'Category not found');
      }
      return category;
    } catch (error: any) {
      throw new HttpException(HttpStatus.SERVER_ERROR, `Failed to find category: ${error.message}`, error.errors);
    }
  }

  public update = async (id: string, model: UpdateCategoryDto): Promise<ICategory> => {
    try {
      if (isEmptyObject(model)) {
        throw new HttpException(HttpStatus.BAD_REQUEST, 'Category name is required');
      }

      const errorResults: IError[] = [];

      //check name is duplicated
      const existingCategory = await this.categorySchema.findOne({ name: model.name });
      if (existingCategory && existingCategory._id !== id) {
        errorResults.push({ field: 'name', message: 'Category name already exists' });
      }

      //check name is valid
      if (model.name && model.name.length < 2) {
        errorResults.push({ field: 'name', message: 'Category name must be at least 2 characters long' });
      }

      //check description is valid
      if (model.description && model.description.length < 2) {
        errorResults.push({ field: 'description', message: 'Category description must be at least 2 characters long' });
      }

      if (errorResults.length) {
        throw new HttpException(HttpStatus.BAD_REQUEST, 'Validation failed', errorResults);
      }

      // params validation
      const updateData = {
        name: model.name,
        description: model.description
      };

      const category = await this.categorySchema.updateOne({ _id: id }, updateData);
      if (!category) {
        throw new HttpException(HttpStatus.NOT_FOUND, 'Category not found');
      }

      const result = await this.categorySchema.findOne({ _id: id });
      if (!result) {
        throw new HttpException(HttpStatus.NOT_FOUND, 'Category not found');
      }
      return result;
    } catch (error: any) {
      throw new HttpException(HttpStatus.SERVER_ERROR, `Failed to update category: ${error.message}`, error.errors);
    }
  }

  public delete = async (id: string): Promise<boolean> => {
    try {
      const item = await this.getItemById(id);

      if (!item) {
        throw new HttpException(HttpStatus.NOT_FOUND, 'Category not found');
      }

      const deleteResult = await this.categorySchema.deleteOne({ _id: id } );

      if (!deleteResult.acknowledged) {
        throw new HttpException(HttpStatus.NOT_FOUND, 'Category not found');
      }

      return true;
    } catch (error: any) {
      throw new HttpException(HttpStatus.SERVER_ERROR, `Failed to delete category: ${error.message}`, error.errors);
    }
  }

  public searchCategoryWithProducts = async (id: string): Promise<ICategory | null> => {
    try {
      const category =  await this.categorySchema.findOne({ _id: id });
      if(!category) {
        throw new HttpException(HttpStatus.NOT_FOUND, 'Category not found');
      }
      const products = await this.productSchema.find({ category_id: id });
      category.products = products;
      await this.getItemById
      return category;
    } catch (error: any) {
      throw new HttpException(HttpStatus.SERVER_ERROR, `Failed to get products by category id: ${error.message}`, error.errors);
    }
  }
}