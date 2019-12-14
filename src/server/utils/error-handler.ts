import { NextFunction, Request, Response } from "express";
import { getStatusText, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { EndPoint, FailedResponse } from "../../types/types";
import { logger } from "./logger";
import { apiResponse, failedResponse } from "./response";

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
        return res.status(500).send({ error: "Something failed!" });
    }

    return next(err);
}

export function errorHandler (
    err: Error,
    req: Request,
    res: Response
): Response {
    return res.status(500).send({ error: err.message });
}

export function handler (endPoint: EndPoint) {
    return function (req: Request, res: Response) {
        try {
            logger.http(req.url)
            return endPoint(req, res, logger)
        } catch (error) {
            return apiResponse<FailedResponse>(res, failedResponse(getStatusText(INTERNAL_SERVER_ERROR)), INTERNAL_SERVER_ERROR)
        }
    }
}
