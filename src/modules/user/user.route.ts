import { Router } from 'express';
import { API_PATH } from '../../core/constants';
import { IRoute } from '../../core/interfaces';
import { authMiddleWare, validationMiddleware } from '../../core/middleware';
import RegisterDto from './dtos/register.dto';
import SearchPaginationUserDto from './dtos/searchPaginationUser.dto';
import UpdateUserDto from './dtos/updateUser.dto';
import UserController from './user.controller';
import { UserRoleEnum } from './user.enum';
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
            `${this.path}/create`,
            validationMiddleware(RegisterDto),
            this.userController.createUser,
        );

        // POST domain:/api/users/search -> Get all users includes params: keyword, status, role
        this.router.post(
            `${this.path}/search`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            validationMiddleware(SearchPaginationUserDto),
            this.userController.getUsers,
        );

        // GET domain:/api/users/ -> Get all users
        this.router.get(`${this.path}/`, authMiddleWare([], true), this.userController.getUsers);

        // GET domain:/api/users/:id -> Get user by id
        this.router.get(`${this.path}/:id`, authMiddleWare([], true), this.userController.getUserById);

            // PUT domain:/api/users/change-role -> Change user role
        this.router.put(
            `${this.path}/change-role`,
            authMiddleWare([UserRoleEnum.ADMIN]),
            validationMiddleware(ChangeRoleDto),
            this.userController.changeRole,
        );


        // PUT domain:/api/users/:id -> Update user
        this.router.put(
            `${this.path}/:id`,
            authMiddleWare(),
            validationMiddleware(UpdateUserDto),
            this.userController.updateUser,
        );

        // POST domain:/api/users/:id -> Delete user logic
        this.router.delete(`${this.path}/:id`, authMiddleWare([UserRoleEnum.ADMIN]), this.userController.deleteUser);
    }
}
