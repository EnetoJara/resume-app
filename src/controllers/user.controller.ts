import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST, CREATED, getStatusText, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED } from "http-status-codes";
import { DB } from "../models/index";
import { UserModel } from "../models/users";
import { UserRegister } from "../types/restApi";
import { encriptPassword, isEqualsPassword } from "../utils/encripter";
import { createToken, validateToken } from "../utils/passport";
import { apiResponse } from "../utils/response";
import { isTokenExpired, validateLogin, validateUserRegistration } from "../utils/validator";
import { logger } from "./../utils/logger";

export class UserController {
    public constructor (public db: DB) {
        this.register = this.register.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.login = this.login.bind(this);
    }

    public authMiddleware (
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const token = req.headers.authorization;
        try {
            if (typeof token !== "string") {
                console.log(token);

                return apiResponse<string>(
                    res,
                    getStatusText(UNAUTHORIZED),
                    UNAUTHORIZED
                );
            }
            const aux = token.split(" ");
            const encoded: any = validateToken(aux[1]);

            if (
                typeof encoded.id !== "number" ||
                typeof encoded.email !== "string"
            ) {
                return apiResponse(
                    res,
                    { success: false, message: getStatusText(UNAUTHORIZED) },
                    UNAUTHORIZED
                );
            }

            return next();
        } catch (error) {
            console.error({ ...error });
            if (isTokenExpired(error)) {
                return apiResponse(
                    res,
                    { success: false, ...error },
                    UNAUTHORIZED
                );
            }

            return apiResponse(
                res,
                {
                    success: false,
                    message: getStatusText(INTERNAL_SERVER_ERROR),
                },
                INTERNAL_SERVER_ERROR
            );
        }
    }
    public register (req: Request, res: Response) {
        const user = <UserRegister>req.body;
        console.log("res.headers: ", req.headers);
        const erros = validateUserRegistration(user);

        if (erros.length > 0) {
            return apiResponse(res, erros, BAD_REQUEST);
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
                return apiResponse(
                    res,
                    { success: true, message: getStatusText(CREATED) },
                    CREATED
                );
            })
            .catch(error => {
                const {
                    code = INTERNAL_SERVER_ERROR,
                    message = getStatusText(INTERNAL_SERVER_ERROR),
                } = error;

                return apiResponse(res, { success: false, message }, code);
            });
    }

    public async login (req: Request, res: Response) {
        logger.info(`login ${req.body.email}`);
        try {
            const loginCredentials = req.body;

            const errors = validateLogin(loginCredentials);
            if (errors.length > 0) {
                logger.warn(errors);

                return apiResponse(res, errors, BAD_REQUEST);
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

                return apiResponse<string>(
                    res,
                    getStatusText(NOT_FOUND),
                    NOT_FOUND
                );
            }

            const token = await createToken({
                id: isThere.id,
                email: isThere.email,
                name: isThere.name,
                middleName: isThere.middleName,
                lastName: isThere.lastName,
                secondLastName: isThere.secondLastName,
            });

            return apiResponse(
                res,
                { success: true, token: `Bearer ${token}` },
                OK
            );
        } catch (error) {
            logger.error(error);

            return apiResponse<Error>(res, error, INTERNAL_SERVER_ERROR);
        }
    }

    public async getAllUsers (req: Request, res: Response, next: NextFunction) {
        try {
            const { rows, count } = await this.db.User.findAndCountAll({
                attributes: ["id", "name", "lastName", "email"],
            });

            return apiResponse(res, { success: true, users: rows, count }, OK);
        } catch (error) {
            console.error(error);

            return apiResponse(
                res,
                { success: false, ...error },
                INTERNAL_SERVER_ERROR
            );
        }
    }
}
