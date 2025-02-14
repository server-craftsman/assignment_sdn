import { IsBoolean, IsIn, IsString } from 'class-validator';
import { UserRoles } from '../user.constant';
import { UserRole } from '../user.interface';

export default class SearchUserDto {
    constructor(
        keyword: string = '',
        role: UserRole | string = '',
    ) {
        this.keyword = keyword;
        this.role = role;
    }

    @IsString()
    public keyword: string;

    @IsIn(UserRoles)
    public role: UserRole | string;
}
