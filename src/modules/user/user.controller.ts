import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/enums';
import { HttpException } from '../../core/exceptions';
import { formatResponse } from '../../core/utils';
import RegisterDto from './dtos/register.dto';
import ChangePasswordDto from './dtos/changePassword.dto';
import UpdateUserDto from './dtos/updateUser.dto';
import { IUser } from './user.interface';
import UserService from './user.service';
import { UserRoleEnum } from './user.enum';
export default class UserController {
    private userService = new UserService();

    // TODO: generate user admin
    public generateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model = new RegisterDto(
                'Nguyen Dan Huy',
                'admin@gmail.com',
                '12345',
                UserRoleEnum.ADMIN,
                'Huy is a good boy',
                '0869872830',
                'https://i.pinimg.com/originals/0d/35/fc/0d35fc27612422347e8f48f52053b79d.jpg',
                new Date('2003-01-01'),
                new Date(),
                new Date(),
            );
            const user: IUser = await this.userService.createUser(model);
            res.status(HttpStatus.CREATED).json(formatResponse<IUser>(user));
        } catch (error) {
            next(error);
        }
    };

    // TODO: create user
    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: RegisterDto = req.body;
            const user: IUser = await this.userService.createUser(model);
            res.status(HttpStatus.CREATED).json(formatResponse<IUser>(user));
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
            res.status(HttpStatus.OK).json(formatResponse<string>('Role changed successfully'));
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
            res.status(HttpStatus.OK).json(formatResponse<string>('User deleted successfully'));
        } catch (error) {
            next(error);
        }
    };

    // TODO: change password user
    public changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const model: ChangePasswordDto = req.body;
            await this.userService.changePassword(userId, model);
            res.status(HttpStatus.OK).json(formatResponse<string>(`Password of user ${model.user_id} changed successfully`));
        } catch (error) {
            next(error);
        }
    };
}
