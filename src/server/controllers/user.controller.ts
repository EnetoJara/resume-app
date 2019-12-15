import { NextFunction, Request, Response } from "express";
import {
    BAD_REQUEST,
    getStatusText,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
} from "http-status-codes";
import { UserRegister } from "../../types/types";
import { UserService } from "../services";
import { encriptPassword, isEqualsPassword } from "../utils/encripter";
import { createToken } from "../utils/passport";
import {
    apiResponse,
    failedResponse,
    successResponse,
} from "../utils/response";
import { logger } from "../utils/logger";

/**
 * @description User controller
 * @class
 * @public
 * @author Ernesto Jara Olveda
 */
export class UserController {
    /**
     * @description Creates an instance of user controller.
     * @author Ernesto Jara Olveda
     * @constructor
     * @param {UserService} userService
     */
    public constructor (private userService: UserService) {
        this.register = this.register.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.login = this.login.bind(this);
    }

    /**
     * register a new user into the system
     * @author Ernesto Jara Olveda
     * @Post
     * @async
     * @public
     * @method {register}
     * @memberof {UserController}
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async register (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> {
        try {
            const user = <UserRegister>req.body;
            logger.info("register");

            const isEmailAlready = await this.userService.getUserByEmail(
                user.email
            );
            if (isEmailAlready !== null) {
                logger.warn(`the email ${isEmailAlready.email} already exists`);
                return apiResponse(
                    res,
                    failedResponse("email already exists"),
                    BAD_REQUEST
                );
            }

            user.password = await encriptPassword(user.password, 10);

            const success = await this.userService.save(user);

            return apiResponse(
                res,
                successResponse(getStatusText(success)),
                success
            );
        } catch (error) {
            logger.error("error while register", { meta: { ...error } });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @description Logins user controller
     * @Post
     * @async
     * @public
     * @method {login}
     * @memberologinf {UserController}
     * @description Logins user controller
     * @author Ernesto Jara Olveda
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async login (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> {
        try {
            logger.info(`login ${req.body.email}`);
            const loginCredentials = req.body;

            const stored = await this.userService.getUserByEmail(
                loginCredentials.email
            );

            if (stored === null) {
                logger.warn(`user not found: ${loginCredentials.email}`);

                return apiResponse(
                    res,
                    failedResponse("user not found"),
                    NOT_FOUND
                );
            }

            const samePassword = await isEqualsPassword(
                stored.password,
                loginCredentials.password
            );

            if (!samePassword) {
                logger.warn("wrong password");
                return apiResponse(
                    res,
                    failedResponse("user not found"),
                    NOT_FOUND
                );
            }

            const toSend = {
                id: stored.id,
                email: stored.email,
                name: stored.name,
                middleName: stored.middleName,
                lastName: stored.lastName,
                secondLastName: stored.secondLastName,
            };

            const token = createToken(toSend);

            return apiResponse(
                res,
                successResponse({
                    ...toSend,
                    token: `Bearer ${token}`,
                }),
                OK
            );
        } catch (error) {
            logger.error("error while register", { meta: { ...error } });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Gets all the users stored at the db
     * @Get
     * @async
     * @public
     * @method {getAllUsers}
     * @memberologinf {UserController}
     * @author Ernesto Jara Olveda
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async getAllUsers (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> {
        logger.info("getAllUsers");
        try {
            const users = await this.userService.getAllUsers();

            return apiResponse(res, successResponse(users), OK);
        } catch (error) {
            logger.error("error while getting all users", {
                meta: { ...error },
            });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR
            );
        }
    }
}
