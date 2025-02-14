import { IsBoolean, IsDate, IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';
import { UserRoles } from '../user.constant';
import { UserRole } from '../user.interface';
import { UserRoleEnum } from './../user.enum';

export default class RegisterDto {
    constructor(
        name: string,
        email: string,
        password: string,
        role: UserRole = UserRoleEnum.STUDENT,
        description: string = '',
        phone_number: string = '',
        avatar_url: string = '',
        dob: Date = new Date(),

        is_verified: boolean = false,
        verification_token: string = '',
        verification_token_expires: Date = new Date(),
        token_version: number = 0,

        created_at: Date = new Date(),
        updated_at: Date = new Date(),
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.description = description;
        this.phone_number = phone_number;
        this.avatar_url = avatar_url;
        this.dob = dob;
        this.is_verified = is_verified;
        this.verification_token = verification_token;
        this.verification_token_expires = verification_token_expires;
        this.token_version = token_version;

        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @MinLength(6)
    public password: string;

    @IsIn(UserRoles)
    public role: UserRole;

    public description: string;
    public phone_number: string;
    public avatar_url: string;

    @IsDate()
    public dob: Date;

    public is_verified: boolean;
    public verification_token: string;
    public verification_token_expires: Date;
    public token_version: number;

    @IsDate()
    public created_at: Date;

    @IsDate()
    public updated_at: Date;

}
