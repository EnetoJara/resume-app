import { NextFunction, Request, Response } from "express";
import {
    BAD_REQUEST,
    getStatusText,
    INTERNAL_SERVER_ERROR,
} from "http-status-codes";
import { FailedResponse } from "../../types/types";
import { logger } from "./logger";
import { apiResponse, failedResponse } from "./response";
import {
    removeEmpty,
    validateLogin,
    validateUserRegistration,
} from "./validator";

export function logging (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logger.error(err);
    next(err);
}

export function clientErrorHandler (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.xhr) {
        res.status(500).send({ error: "Something failed!" });
    } else {
        next(err);
    }
}

export function errorHandler (err: Error, req: Request, res: Response) {
    res.status(500).send({ error: err.message });
}

export function timeMiddleware (req: any, res: Response, next: NextFunction) {
    req.requestTime = Date.now();
    next();
}

export function validateRegister (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body = removeEmpty(req.body);

        const valid = validateUserRegistration(req.body);

        if (valid.length > 0) {
            apiResponse<FailedResponse>(
                res,
                failedResponse(valid),
                BAD_REQUEST
            );
        } else {
            next();
        }
    } catch (error) {
        apiResponse<FailedResponse>(
            res,
            failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
            INTERNAL_SERVER_ERROR
        );
    }
}
export function validatingLogin (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body = removeEmpty(req.body);

        const valid = validateLogin(req.body);

        if (valid.length > 0) {
            apiResponse<FailedResponse>(
                res,
                failedResponse(valid),
                BAD_REQUEST
            );
        } else {
            next();
        }
    } catch (error) {
        apiResponse<FailedResponse>(
            res,
            failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
            INTERNAL_SERVER_ERROR
        );
    }
}
