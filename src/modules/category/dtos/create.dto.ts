import { IsString, IsOptional, MinLength } from 'class-validator';
// Ensure that input data is always in the same format.
export class CreateCategoryDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  // Partial is a type in TypeScript that allows you missing properties optionally
  constructor(data: Partial<CreateCategoryDto> = {}) {
    // if (!data.name) {
    //   throw new Error('Category name is required');
    // }
    this.name = data.name || '';
    this.description = data.description;
  }
}