import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

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
