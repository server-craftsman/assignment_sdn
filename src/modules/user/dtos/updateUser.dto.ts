import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class UpdateUserDto {
    constructor(
        name: string,
        description: string,
        phone_number: string,
        avatar_url: string,
        dob: Date | string,
        email: string,
    ) {
        this.name = name;
        this.description = description;
        this.phone_number = phone_number;
        this.avatar_url = avatar_url;
        this.dob = dob;
        this.email = email;
    }

    @IsNotEmpty()
    public name: string;

    @IsString()
    public description: string;

    @IsString()
    public phone_number: string;

    @IsString()
    public avatar_url: string;

    @IsDate()
    public dob: Date | string;

    @IsEmail()
    public email: string;
}
