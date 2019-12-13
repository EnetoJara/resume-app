import { Response } from "express";
import { getStatusText, NOT_ACCEPTABLE } from "http-status-codes";
import { parse } from "js2xmlparser";
import { FailedResponse, SuccessResponse } from "../types/restApi";
import { applicationJson, applicationXml } from "./constants";

export interface ApiResponse {
    <T>(
        res: Response,
        data: T,
        statusCode: number,
        rootElement?: string
    ): Response;
}

export const apiResponse: ApiResponse = (
    res,
    data,
    statusCode,
    rootElement = ""
): Response => {
    return res.format({
        json: () => {
            res.type(applicationJson);
            res.status(statusCode).send(data);
        },
        xml: () => {
            res.type(applicationXml);
            res.status(statusCode).send(parse(rootElement || "", data));
        },
        default: () => {
            res.status(NOT_ACCEPTABLE).send(getStatusText(NOT_ACCEPTABLE));
        },
    });
};

export function successResponse (data): SuccessResponse {
    return {
        success: true,
        data: data
    }
}
export function failedResponse (data): FailedResponse {
    return {
        success: false,
        data: data
    }
}
