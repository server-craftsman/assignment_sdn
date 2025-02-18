import bcryptjs from 'bcryptjs';
import moment from 'moment';
import { HttpStatus } from '../../core/enums';
import { HttpException } from '../../core/exceptions';
import { createToken, isEmptyObject, encodePasswordUserNormal, createTokenVerifiedUser } from '../../core/utils';
import { IUser, UserSchema } from '../user';
import { TokenData } from './auth.interface';
import LoginDto from './dtos/login.dto';
import RegisterDto from '../user/dtos/register.dto';
import { v4 as uuidv4 } from "uuid";

export default class AuthService {
    public userSchema = UserSchema;

    public async login(model: LoginDto): Promise<TokenData> {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Model user is empty');
        }

        let emailCheck = model.email;

        const user = await this.userSchema.findOne({ email: emailCheck }).exec(); // find user by email by using exec() optimize query performance
        if (!user) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `Your email: ${emailCheck} is not exists.`);
        }


        // login normal
        if (model.password) {
            const isMatchPassword = await bcryptjs.compare(model.password, user.password!); // compare password user input with user password in database
            if (!isMatchPassword) {
                throw new HttpException(HttpStatus.BAD_REQUEST, `Your password is incorrect!`);
            }
        }

        if (!user.token_version) {
            user.token_version = 0;
        }

        return createToken(user);
    }

    public async getCurrentLoginUser(userId: string): Promise<IUser> {
        const user = await this.userSchema.findById(userId).lean(); // find user by id by using lean() optimize memory performance
        if (!user) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `User is not exists.`);
        }
        delete user.password;
        return user;
    }

    public async logout(userId: string): Promise<boolean> {
        const user = await this.userSchema.findById(userId);
        if (!user) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `Cannot logout user!`);
        }

        user.token_version += 1;
        if (user.token_version >= Number.MAX_SAFE_INTEGER) {
            user.token_version = 0;
        }

        await user.save();
        return true;
    }
}