import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DataStoredInToken } from '../../modules/auth';
import { UserRole, UserSchema } from '../../modules/user';
import { HttpStatus } from '../enums';
import { logger } from '../utils';

const authMiddleWare = (roles?: UserRole[], isClient = false): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authHeader = req.headers['authorization']; // access token from header

        if (isClient) {
            if (!authHeader) {
                req.user = { id: '', role: null, version: 0 };
                return next();
            }
        } else {
            if (!authHeader) {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'No token, authorization denied.' });
                return;
            }
        }

        await handleCheckToken(req, res, next, authHeader, roles);
    };
};

const handleCheckToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
    authHeader: string | undefined,
    roles?: UserRole[],
): Promise<void> => {
    const userSchema = UserSchema;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'No token, authorization denied.' });
            return;
        }

        try {
            const userToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET ?? '') as DataStoredInToken; // decode token
            if (!req.user) {
                req.user = { id: '', role: null, version: 0 };
            }
            req.user.id = userToken.id;
            req.user.role = userToken.role;
            req.user.version = userToken.version;

            // check user version
            const user = await userSchema.findOne({ _id: userToken.id }).lean();
            if (!user || String(user?.token_version) !== String(userToken.version)) {
                res.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied: invalid token!' });
                return;
            }

            // check roles if provided
            if (roles && roles.length > 0 && !roles.includes(req.user.role)) {
                res.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied: insufficient role' });
                return;
            }

            next();
        } catch (error) {
            logger.error(`[ERROR] Msg: ${token}`);
            if (error instanceof Error) {
                if (error.name === 'TokenExpiredError') {
                    res.status(HttpStatus.FORBIDDEN).json({ message: 'Token is expired' });
                } else {
                    res.status(HttpStatus.FORBIDDEN).json({ message: 'Token is not valid' });
                }
            } else {
                res.status(HttpStatus.SERVER_ERROR).json({ message: 'An unknown error occurred' });
            }
            return;
        }
    }
};

export default authMiddleWare;
