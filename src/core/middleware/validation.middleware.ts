
import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpStatus } from "../enums";
import { HttpException } from "../exceptions";
import { IError } from "../interfaces";

const validationMiddleware = (type: any, skipMissingProperties = false): RequestHandler => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return (req: Request, res: Response, next: NextFunction) => {
        validate(plainToInstance(type, req.body), { skipMissingProperties: skipMissingProperties }).then( // validate the request body against the class
            (errors: ValidationError[]) => { // if there are errors
                if (errors.length > 0) {
                    let errorResults: IError[] = [];

                    const extractConstraints = (error: ValidationError) => { // extract the constraints from the error
                        if (error.constraints) { // if there are constraints
                            Object.values(error.constraints || {}).forEach((message) => { // iterate through the constraints
                                errorResults.push({ // add the error to the results
                                    message,
                                    field: error.property,
                                });
                            });
                        }
                        if (error.children && error.children.length > 0) { // if there are children
                            error.children.forEach((childError) => { // iterate through the children
                                extractConstraints(childError); // extract the constraints from the child
                            });
                        }
                    };

                    errors.forEach((error) => { // iterate through the errors
                        extractConstraints(error); // extract the constraints from the error
                    });

                    next(new HttpException(HttpStatus.BAD_REQUEST, "", errorResults));
                } else {
                    next();
                }
            }
        );
    };
};

export default validationMiddleware;
