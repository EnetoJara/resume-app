import Bluebird from "bluebird";
import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST, CREATED, getStatusText, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED } from "http-status-codes";
import { FailedResponse, SuccessResponse, UserRegister } from "../../types/types";
import { DB } from "../models/index";
import { UserModel } from "../models/users";
import { encriptPassword, isEqualsPassword } from "../utils/encripter";
import { logger } from "../utils/logger";
import { createToken, validateToken } from "../utils/passport";
import { apiResponse, failedResponse, successResponse } from "../utils/response";
import { isTokenExpired, validateLogin, validateUserRegistration } from "../utils/validator";

export class UserController {
    public constructor (public db: DB) {
        this.register = this.register.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.login = this.login.bind(this);
    }

    public authMiddleware(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        try {
            if (typeof token !== "string") {

                return apiResponse<FailedResponse>(
                    res,
                    failedResponse(getStatusText(UNAUTHORIZED)),
                    UNAUTHORIZED
                );
            }
            const aux = token.split(" ");
            const encoded: any = validateToken(aux[1]);

            if (
                typeof encoded.id !== "number" ||
                typeof encoded.email !== "string"
            ) {
                return apiResponse<FailedResponse>(
                    res,
                    failedResponse(getStatusText(UNAUTHORIZED)),
                    UNAUTHORIZED
                );
            }

            return next();
        } catch (error) {
            if (isTokenExpired(error)) {
                return apiResponse<FailedResponse>(
                    res,
                    failedResponse({ ...error }),
                    UNAUTHORIZED
                );
            }

            return apiResponse<FailedResponse>(
                res,
                failedResponse(getStatusText(UNAUTHORIZED)),
                INTERNAL_SERVER_ERROR
            );
        }
    }

    public register(req: Request, res: Response, logger): Promise<Response> {
        const user = <UserRegister>req.body;
        logger.info("register");
        const erros = validateUserRegistration(user);

        if (erros.length > 0) {
            return new Promise((resolve) => resolve(apiResponse<FailedResponse>(
                res,
                failedResponse(erros),
                BAD_REQUEST
            )));
        }

        return encriptPassword(user.password, 10)
            .then((passwordEncripted: string) => {
                user.password = passwordEncripted;

                return this.db.User.findOne<UserModel>({
                    where: { email: user.email },
                });
            })
            .then(saved => {
                if (saved !== null) {
                    throw { code: BAD_REQUEST, message: "User already exists" };
                }

                return this.db.User.create({ ...user, active: true });
            })
            .then(() => {
                logger.info(`user created with email: ${user.email}`);

                return apiResponse<SuccessResponse>(
                    res,
                    successResponse(getStatusText(CREATED)),
                    CREATED
                );
            })
            .catch(error => {
                logger.error({ ...error });
                const {
                    code = INTERNAL_SERVER_ERROR,
                    message = getStatusText(INTERNAL_SERVER_ERROR),
                } = error;

                return apiResponse<FailedResponse>(
                    res,
                    failedResponse(message),
                    code
                );
            });
    }

    public async login(req: Request, res: Response) {
        logger.info(`login ${req.body.email}`);
        const loginCredentials = req.body;

        const errors = validateLogin(loginCredentials);
        if (errors.length > 0) {
            logger.warn("invalid login: ", { meta: { ...errors } });

            return apiResponse<FailedResponse>(
                res,
                failedResponse(errors),
                BAD_REQUEST
            );
        }

        const isThere = await this.db.User.findOne({
            where: { email: loginCredentials.email },
        });

        if (isThere === null) {
            logger.warn(`user not found: ${loginCredentials.email}`);

            return apiResponse<string>(
                res,
                getStatusText(NOT_FOUND),
                NOT_FOUND
            );
        }

        const samePassword = await isEqualsPassword(
            isThere.password,
            loginCredentials.password
        );

        if (!samePassword) {
            logger.warn("wrong password");

            return apiResponse<FailedResponse>(
                res,
                failedResponse(getStatusText(NOT_FOUND)),
                NOT_FOUND
            );
        }

        const token = createToken({
            id: isThere.id,
            email: isThere.email,
            name: isThere.name,
            middleName: isThere.middleName,
            lastName: isThere.lastName,
            secondLastName: isThere.secondLastName,
        });

        return apiResponse<SuccessResponse>(
            res,
            successResponse({
                success: true,
                id: isThere.id,
                email: isThere.email,
                name: isThere.name,
                middleName: isThere.middleName,
                lastName: isThere.lastName,
                secondLastName: isThere.secondLastName,
                token: `Bearer ${token}`,
            }),
            OK
        );

    }

    public getAllUsers(req: Request, res: Response): Bluebird<Response> {
        return this.db.User.findAndCountAll<UserModel>({
            attributes: ["id", "name", "lastName", "email"],
        })
            .then(result => {
                const { rows, count } = result;

                return apiResponse<SuccessResponse>(
                    res,
                    successResponse({ users: rows, count }),
                    OK
                );
            })
            .catch(error => {
                logger.error(`${{ ...error }}`);

                return apiResponse(
                    res,
                    failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                    INTERNAL_SERVER_ERROR
                );
            });
    }
}
