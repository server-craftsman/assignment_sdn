import { Router } from 'express';
import { API_PATH } from '../../core/constants';
import { IRoute } from '../../core/interfaces';
import { authMiddleWare, validationMiddleware } from '../../core/middleware';
import UserController from './user.controller';
import { UserRoleEnum } from './user.enum';
import ChangePasswordDto from './dtos/changePassword.dto';
import ChangeRoleDto from './dtos/changeRole.dto';

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
            API_PATH.CREATE_USER,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.userController.createUser,
        );

        // GET domain:/api/users/ -> Get all users
        this.router.get(`${this.path}/`, authMiddleWare([], true), this.userController.getUsers);

        // GET domain:/api/users/:id -> Get user by id
        this.router.get(`${this.path}/:id`, authMiddleWare([], true), this.userController.getUserById);

            // PUT domain:/api/users/change-role -> Change user role
        this.router.put(
            API_PATH.CHANGE_ROLE,
            authMiddleWare([UserRoleEnum.ADMIN]),
            validationMiddleware(ChangeRoleDto),
            this.userController.changeRole,
        );

        // PUT domain:/api/users/:id -> Update user info
        this.router.put(
            `${this.path}/:id`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            this.userController.updateUser,
        );

        // PUT domain:/api/users/change-password -> Change user password
        this.router.put(
            API_PATH.CHANGE_PASSWORD,
            authMiddleWare(),
            validationMiddleware(ChangePasswordDto),
            this.userController.changePassword,
        );

        // POST domain:/api/users/:id -> Delete user logic
        this.router.delete(`${this.path}/:id`, authMiddleWare([UserRoleEnum.ADMIN]), this.userController.deleteUser);

        
    }
}
