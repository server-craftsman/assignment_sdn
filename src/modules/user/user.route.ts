import { Router } from 'express';
import { API_PATH } from '../../core/constants';
import { IRoute } from '../../core/interfaces';
import { authMiddleWare } from '../../core/middleware';
import UserController from './user.controller';
import { UserRoleEnum } from './user.enum';

export default class UserRoute implements IRoute {
    public path = API_PATH.USER;
    public router = Router();
    public userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        // POST domain:/api/users -> Create normal user
        this.router.post(
            `${this.path}/create`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.userController.createUser,
        );

        // GET domain:/api/users/ -> Get all users
        this.router.get(`${this.path}/`, authMiddleWare([], true), this.userController.getUsers);

        // GET domain:/api/users/:id -> Get user by id
        this.router.get(`${this.path}/:id`, authMiddleWare([], true), this.userController.getUserById);

            // PUT domain:/api/users/change-role -> Change user role
        this.router.put(
            `${this.path}/change-role`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.userController.changeRole,
        );

        // PUT domain:/api/users/:id -> Update user
        this.router.put(
            `${this.path}/:id`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.userController.updateUser,
        );

        // POST domain:/api/users/:id -> Delete user logic
        this.router.delete(`${this.path}/:id`, authMiddleWare([UserRoleEnum.ADMIN]), this.userController.deleteUser);

        // PUT domain:/api/users/change-password -> Change user password
        this.router.put(
            `${this.path}/change-password`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.userController.changePassword,
        );
    }
}
