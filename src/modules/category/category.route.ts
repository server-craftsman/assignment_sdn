import { Router } from "express";
import { IRoute } from "../../core/interfaces";
import CategoryController from "./category.controller";
import { API_PATH } from "../../core/constants";
import { validationMiddleware } from "../../core/middleware";
import { CreateCategoryDto } from "./dtos/create.dto";
import { UpdateCategoryDto } from "./dtos/update.dto";

export default class CategoryRoute implements IRoute {
    public path = API_PATH.CATEGORY;
    public router = Router();
    public categoryController = new CategoryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // POST domain: /api/categories -> create new category
        this.router.post(
            this.path,
            this.categoryController.create
        );

        // GET domain: /api/categories -> get all categories
        this.router.get(
            this.path,
            this.categoryController.getItems
        );

        // GET domain: /api/categories/:id -> get category by id
        this.router.get(
            `${this.path}/:id`,
            this.categoryController.getItemById
        );

        // PUT domain: /api/categories/:id -> update category by id
        this.router.put(
            `${this.path}/:id`,
            this.categoryController.update
        );

        // DELETE domain: /api/categories/:id -> delete category by id
        this.router.delete(
            `${this.path}/:id`,
            this.categoryController.delete
        );

    }
}