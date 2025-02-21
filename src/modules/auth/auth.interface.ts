import { UserRole } from '../user';

export interface DataStoredInToken {
    id: string;
    role: UserRole | string;
    version: number;
}

export interface TokenData {
    access_token: string;
    refresh_token: string;
}

export const UserInfoInTokenDefault = {
    id: '',
    role: '',
    version: ''
};
