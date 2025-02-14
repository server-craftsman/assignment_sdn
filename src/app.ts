import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./database";
import { ErrorMiddleware } from "./core/middleware";
import { IRoute } from "./core/interfaces";
import { logger } from "./core/utils";

export default class App {
    public app: express.Application;
    public port: string | number;

    constructor(routes: IRoute[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.connectToDatabase();
        this.initializeRoutes(routes);
        this.port = process.env.PORT || 5000;
        this.initializeErrorHandling();
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            logger.info(`Server is running at port ${this.port}`);
        });
    }

    //connect to database
    private async connectToDatabase(): Promise<void> {
        try {
            await connectDB();
        } catch (error) {
            console.error('Failed to connect to database:', error);
            process.exit(1);
        }
    }

    //middleware
    private initializeMiddlewares(): void {
        this.app.use(cors()); //allow cors
        this.app.use(bodyParser.json()); //parse json body
        this.app.use(bodyParser.urlencoded({ extended: true })); // handle form data from client
        this.app.use(morgan("dev")); //log request
    }


    private initializeErrorHandling(): void {
        this.app.use(ErrorMiddleware);
    }

    private initializeRoutes(routes: IRoute[]): void {
        routes.forEach((route) => {
            this.app.use('/', route.router);
        });

    }
}