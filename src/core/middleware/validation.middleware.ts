import { plainToInstance } from "class-transformer"; 
import { ValidationError, validate } from "class-validator"; 
import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpStatus } from "../enums";
import { HttpException } from "../exceptions";
import { IError } from "../interfaces";

const validationMiddleware = (type: any, skipMissingProperties = false): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        // validate the request body after converting it to an instance of the specified class
        validate(plainToInstance(type, req.body), { skipMissingProperties: skipMissingProperties }).then(
            (errors: ValidationError[]) => {
                // check if there are validation errors
                if (errors.length > 0) {
                    // initialize an empty array to store error details
                    let errorResults: IError[] = [];

                    // helper function to extract validation error messages and field names
                    const extractConstraints = (error: ValidationError) => {
                        if (error.constraints) {
                            // If `constraints` exists, loop through and push errors into `errorResults`
                            Object.values(error.constraints || {}).forEach((message) => {
                                errorResults.push({
                                    message, // The validation error message
                                    field: error.property, // The field name associated with the error
                                });
                            });
                        }
                        // If the error has child validation errors, recursively extract them
                        if (error.children && error.children.length > 0) {
                            error.children.forEach((childError) => {
                                extractConstraints(childError); // Recursive call for nested validations
                            });
                        }
                    };

                    // Iterate through each validation error and extract constraints
                    errors.forEach((error) => {
                        extractConstraints(error);
                    });

                    // Pass a custom HTTP exception with error details to the next middleware
                    next(new HttpException(HttpStatus.BAD_REQUEST, "", errorResults));
                } else {
                    // If no validation errors, call the next middleware
                    next();
                }
            }
        );
    };
};

// Export the middleware function so it can be used in other parts of the application
export default validationMiddleware;
