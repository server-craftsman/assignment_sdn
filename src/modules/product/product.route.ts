import { Router } from "express";
import { IRoute } from "../../core/interfaces";
import ProductController from "./product.controller";
import { API_PATH } from "../../core/constants";
import { authMiddleWare } from "../../core/middleware";
import { CreateProductDto } from "./dtos/create.dto";
import { UpdateProductDto } from "./dtos/update.dto";
import { UserRoleEnum } from "../user/user.enum";

export class ProductRoute implements IRoute {
    public path = API_PATH.PRODUCT;
    public router = Router();
    public productController = new ProductController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // POST domain: /api/products -> create new product
        this.router.post(
            this.path,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.productController.create
        );

        // GET domain: /api/products -> get all products
        this.router.get(
            this.path,
            authMiddleWare([], true),
            this.productController.getItems
        );

        // GET domain: /api/products/:id -> get product by id
        this.router.get(
            `${this.path}/:id`,
            authMiddleWare([], true),
            this.productController.getItemById
        );

        // PUT domain: /api/products/:id -> update product by id
        this.router.put(
            `${this.path}/:id`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.productController.update
        );

        //test http method
        // PATCH domain: /api/products/:id -> update product by id
        // this.router.patch(
        //     `${this.path}/:id`,
        //     // validationMiddleware(UpdateProductDto),
        //     this.productController.update
        // );

        // DELETE domain: /api/products/:id -> delete product by id
        this.router.delete(
            `${this.path}/:id`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.productController.delete
        );

        
    };
}