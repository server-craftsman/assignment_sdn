import { validate } from 'class-validator';
import bcryptjs from 'bcryptjs';
import { HttpStatus } from '../../core/enums';
import { HttpException } from '../../core/exceptions';
import { IError } from '../../core/interfaces';
import { checkValidUrl, encodePasswordUserNormal, isEmptyObject } from '../../core/utils';
import RegisterDto from './dtos/register.dto';
import ChangeRoleDto from './dtos/changeRole.dto';
import UpdateUserDto from './dtos/updateUser.dto';
import ChangePasswordDto from './dtos/changePassword.dto';
import { UserRoleEnum } from './user.enum';
import { IUser } from './user.interface';
import UserSchema from './user.model';
import { isValidObjectId } from '../../core/utils';

export default class UserService {
    public userSchema = UserSchema;

    public async createUser(model: RegisterDto): Promise<IUser> {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Model data is empty');
        }

        let newUser = {
            ...model,
            role: model.role || UserRoleEnum.STUDENT,
            description: model.description || '',
            phone_number: model.phone_number || '',
            avatar_url: model.avatar_url || '',
            token_version: 0,
        };

        if (newUser.avatar_url && !checkValidUrl(model.avatar_url)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `The URL '${model.avatar_url}' is not valid`);
        }

        // check email duplicates
        const existingUserByEmail = await this.userSchema.findOne({
            email: { $regex: new RegExp('^' + newUser.email + '$', 'i') }, // reges allow find string with case insensitive
        });
        if (existingUserByEmail) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `Your email: '${newUser.email}' already exists!`);
        }

        // check user !role is admin and required fields
        if (newUser.role) {
            const requiredFields = [
                {
                    field: model.description,
                    title: 'description',
                },
                {
                    field: model.avatar_url,
                    title: 'avatar_url',
                },
                {
                    field: model.phone_number,
                    title: 'phone_number',
                },
            ];

            // check required fields
            for (const item of requiredFields) {
                if (!item.field) {
                    throw new HttpException(HttpStatus.BAD_REQUEST, `${item.title} should not be empty!`);
                }
            }
        }

        // create a new user normal
        if (model.password) {
            // handle encode password
            newUser.password = await encodePasswordUserNormal(model.password);
        }

        const createdUser: IUser = await this.userSchema.create(newUser);
        if (!createdUser) {
            throw new HttpException(HttpStatus.ACCEPTED, `Create item failed!`);
        }
        const resultUser: IUser = createdUser.toObject(); // convert to object
        delete resultUser.password;
        return resultUser;
    }

    public async getAllUsers(): Promise<IUser[]> {
        const users = await this.userSchema.find({}).lean();
        users.forEach(user => {
            delete user.password;
        });
        return users;
    }

    // TODO: get transactions info
    public async getUserById(
        userId: string,
        is_deletedPassword = true,
    ): Promise<IUser> {
        const user = await this.userSchema.findOne({ _id: userId }).lean();
        if (!user) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `Item is not exists.`);
        }
        if (is_deletedPassword) {
            delete user.password;
        }
        return user;
    }

    public async updateUser(userId: string, model: UpdateUserDto): Promise<IUser> {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Model data is empty');
        }

        // check user exits
        const item = await this.getUserById(userId);

        const errorResults: IError[] = [];

        if (model.dob) {
            const dobDate = new Date(model.dob); // convert to date
            if (isNaN(dobDate.getTime())) { // check if date is valid, dob is NaN ?
                errorResults.push({
                    message: 'Please provide value with date type!',
                    field: 'dob',
                });
            }
        }

        // check valid
        if (errorResults.length) {
            throw new HttpException(HttpStatus.BAD_REQUEST, '', errorResults);
        }

        const updateData = {
            name: model.name,
            email: model.email,
            description: model.description || item.description,
            phone_number: model.phone_number || item.phone_number,
            avatar_url: model.avatar_url || item.avatar_url,
            dob: model.dob || item.dob,
            updated_at: new Date(),
        };

        const updateUserId = await this.userSchema.updateOne({ _id: userId }, updateData); 

        if (!updateUserId.acknowledged) { // check if update user info failed by using acknowledged to check if the update operation was successful
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Update user info failed!');
        }

        const updateUser = await this.getUserById(userId); // get user info after update
        return updateUser;
    }

    // TODO: change role
    public async changeRole(model: ChangeRoleDto): Promise<boolean> {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Model data is empty');
        }

        const userId = model.user_id;

        // check user exits
        const user = await this.getUserById(userId);

        // check change role
        if (user.role === model.role) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `User role is already ${model.role}`);
        }

        const updateUserId = await this.userSchema.updateOne(
            { _id: userId },
            { role: model.role, updated_at: new Date() },
        );

        if (!updateUserId.acknowledged) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Update user status failed!');
        }

        return true;
    }

    public async deleteUser(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `Item is not exists.`);
        }

        // check user is admin
        if (user.role === UserRoleEnum.ADMIN) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `You can not delete admin user.`);
        }

        const deleteUser = await this.userSchema.deleteOne({ _id: userId });

        if (!deleteUser.acknowledged) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Delete item failed!');
        }

        return true;
    }

    public async changePassword(model: ChangePasswordDto): Promise<boolean> {
        if (isEmptyObject(model)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Model data is empty');
        }

        const userId = model.user_id

        // Validate userId as a valid ObjectId
        if (!isValidObjectId(userId)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid user ID format');
        }

        // check user exits
        const user = await this.getUserById(userId, false);

        // check old_password
        if (model.old_password) {
            const isMatchPassword = await bcryptjs.compare(model.old_password, user.password!); // compare old password with user password in database
            if (!isMatchPassword) {
                throw new HttpException(HttpStatus.BAD_REQUEST, `Your old password is not valid!`);
            }
        }

        // compare new_password vs old_password
        if (model.new_password === model.old_password) {
            throw new HttpException(HttpStatus.BAD_REQUEST, `New password and old password must not be the same!`);
        }

        // handle encode password
        const newPassword = await encodePasswordUserNormal(model.new_password);
        const updatePasswordUser = await this.userSchema
            .findByIdAndUpdate(userId, {
                ...user,
                password: newPassword,
                updated_at: new Date(),
            })
            .lean();

        if (!updatePasswordUser) throw new HttpException(HttpStatus.BAD_REQUEST, 'Change password failed!');

        return true;
    }
}
