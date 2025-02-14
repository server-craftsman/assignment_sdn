import App from "./app";
import "dotenv/config";
import { CategoryRoute } from "./modules/category";
import { ProductRoute } from "./modules/product";
import { IndexRoute } from './modules/index';
import { UserRoute } from "./modules/user";
import { AuthRoute } from './modules/auth'
const routes = [
    new IndexRoute(),
    new CategoryRoute(),
    new ProductRoute(),
    new UserRoute(),
    new AuthRoute(),
]

const app = new App(routes);

app.listen();