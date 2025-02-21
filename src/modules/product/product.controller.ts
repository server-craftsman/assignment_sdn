import { Request, Response, NextFunction } from 'express'
import { HttpStatus } from '../../core/enums'
import { ProductService } from './product.service'
import { CreateProductDto } from './dtos/create.dto'
import { UpdateProductDto } from './dtos/update.dto'
import { formatResponse } from '../../core/utils'
import { IProduct } from './product.interface'

export default class ProductController {
    public productService = new ProductService()

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: CreateProductDto = new CreateProductDto(req.body)
            const newProduct: IProduct = await this.productService.create(req.user.id, model)
            res.status(HttpStatus.CREATED).json(formatResponse(newProduct))
        } catch (error) {
            next(error)
        }
    }

    public getItems = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await this.productService.getItems()
            res.status(HttpStatus.OK).json(formatResponse(products))
        } catch (error) {
            next(error)
        }
    }
    public getItemById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product: IProduct = await this.productService.getItemById(req.params.id)
            res.status(HttpStatus.OK).json(formatResponse(product))
        } catch (error) {
            next(error)
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: UpdateProductDto = new UpdateProductDto(req.body)
            const product: IProduct = await this.productService.update(req.params.id, req.user.id, model)
            res.status(HttpStatus.OK).json(formatResponse(product))
        } catch (error) {
            next(error)
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.productService.delete(req.params.id, req.user.id)
            res.status(HttpStatus.OK).json(formatResponse<string>('Delete product successfully'))
        } catch (error) {
            next(error)
        }
    }

}