import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { DataStoredInToken, TokenData } from '../../modules/auth';
import { IUser } from '../../modules/user';

export const createToken = (user: IUser): TokenData => {
    const dataInToken: DataStoredInToken = { id: user.id, role: user.role, version: user.token_version };
    const secret: string = process.env.JWT_TOKEN_SECRET!;
    const accessExpiresIn: number = 600; // 10 minutes
    const refreshExpiresIn: number = 86400; // 1 day
    
    // Create refresh token first
    const refresh_token = jwt.sign(dataInToken, secret, { expiresIn: refreshExpiresIn });

    // Include refresh token in the data for access token
    const access_token = jwt.sign(dataInToken, secret, { expiresIn: accessExpiresIn });

    return {
        access_token,
        refresh_token,
    };
};

// create token verification
export const createTokenVerifiedUser = () => {
    return {
        verification_token: crypto.randomBytes(16).toString('hex'),
        verification_token_expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    };
};
