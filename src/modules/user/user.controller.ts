import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/enums';
import { formatResponse } from '../../core/utils';
import UpdateUserDto from './dtos/updateUser.dto';
import { IUser } from './user.interface';
import UserService from './user.service';

export default class UserController {
    private userService = new UserService();

    // TODO: create user
    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model = req.body;
            const user: IUser = await this.userService.createUser(model);
            res.status(HttpStatus.OK).json(formatResponse<IUser>(user));
        } catch (error) {
            next(error);
        }
    };

    // TODO: get users
    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.userService.getAllUsers();
            const users: IUser[] = result;
            res.status(HttpStatus.OK).json(formatResponse<IUser[]>(users));
        } catch (error) {
            next(error);
        }
    };

    // TODO: get user by id
    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: IUser = await this.userService.getUserById(req.params.id);
            res.status(HttpStatus.OK).json(formatResponse<IUser>(user));
        } catch (error) {
            next(error);
        }
    };

    // TODO: change role
    public changeRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model = req.body;
            await this.userService.changeRole(model);
            res.status(HttpStatus.OK).json(formatResponse<null>(null));
        } catch (error) {
            next(error);
        }
    };

    // TODO: update user
    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: UpdateUserDto = req.body;
            const user: IUser = await this.userService.updateUser(req.params.id, model);
            res.status(HttpStatus.OK).json(formatResponse<IUser>(user));
        } catch (error) {
            next(error);
        }
    };

    // TODO: delete user    
    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(HttpStatus.OK).json(formatResponse<null>(null));
        } catch (error) {
            next(error);
        }
    };
}
