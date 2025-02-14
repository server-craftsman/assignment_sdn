import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    name: string;
    category_id: string;
    image_url: string;

    @IsNumber()
    price: number;
    discount: number;
    
    @IsOptional()
    @IsString()
    description?: string;

    constructor(data: Partial<UpdateProductDto> = {}) { 
        this.name = data.name || '';
        this.description = data.description;
        this.category_id = data.category_id || '';
        this.price = data.price || 0;
        this.discount = data.discount || 0;
        this.image_url = data.image_url || 'https://via.placeholder.com/150';
    }
}