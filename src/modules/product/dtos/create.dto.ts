import { IsString, IsOptional, MinLength, IsNumber, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    name: string;

    @IsString()
    category_id: string;

    @IsNumber()
    price: number;
    discount: number

    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Description must be at least 2 characters long' })
    description?: string;

    @IsOptional()
    @IsString()
    image_url?: string | undefined;

    @IsOptional()
    @IsDate()
    createdAt?: Date;
    updatedAt?: Date;

    constructor(data: Partial<CreateProductDto> = {}) {
        this.name = data.name || '';
        this.description = data.description;
        this.category_id = data.category_id || '';
        this.price = data.price || 0;
        this.discount = data.discount || 0;
        this.image_url = data.image_url || 'https://via.placeholder.com/150';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }
}