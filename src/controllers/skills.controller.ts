import Bluebird from "bluebird";
import { NextFunction, Request, Response } from "express";
import { getStatusText, INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import { DB } from "../models/index";
import { SkillsModel } from "../models/skills";
import { SkillsTypeModel } from "../models/skills-type";
import { FailedResponse, SuccessResponse } from "../types/restApi";
import { logger } from "../utils/logger";
import {
    apiResponse,
    failedResponse,
    successResponse,
} from "../utils/response";
import { isNumber } from "../utils/validator";

export class SkillsController {
    public constructor (private db: DB) {
        this.getSkills = this.getSkills.bind(this);
        this.getSkillsTypeById = this.getSkillsTypeById.bind(this);
    }

    public getSkills (
        req: Request,
        res: Response,
        next: NextFunction
    ): Bluebird<Response> {
        logger.info("getSkills");

        return this.db.Skills.findAll({ attributes: ["id", "skill"] })
            .then((skills: SkillsModel[]) =>
                apiResponse<SuccessResponse<SkillsModel[]>>(
                    res,
                    successResponse(skills),
                    OK
                )
            )
            .catch(error => {
                logger.error(error);

                return apiResponse<FailedResponse<string>>(
                    res,
                    failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                    INTERNAL_SERVER_ERROR
                );
            });
    }

    public getSkillsTypeById (
        req: Request,
        res: Response,
        next: NextFunction
    ): Bluebird<Response> {
        logger.info("getSkillsTypeById");

        const { idSkill } = req.params;
        const criteria = isNumber(Number(idSkill)) ? idSkill : 0;

        return this.db.SkillsType.findAll({
            attributes: ["id", "name"],
            where: { skillId: criteria },
        })
            .then((skills: SkillsTypeModel[]) =>
                apiResponse<SuccessResponse<SkillsTypeModel[]>>(
                    res,
                    successResponse(skills),
                    OK
                )
            )
            .catch(error => {
                logger.error(error);

                return apiResponse<FailedResponse<string>>(
                    res,
                    failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                    INTERNAL_SERVER_ERROR
                );
            });
    }
}
