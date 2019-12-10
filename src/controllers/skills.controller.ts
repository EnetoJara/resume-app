import Bluebird from "bluebird";
import { NextFunction, Request, Response } from "express";
import { getStatusText, INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import { DB } from "../models/index";
import { apiResponse } from "../utils/response";
export class SkillsController {
    public constructor(private db: DB) {
        this.getSkills = this.getSkills.bind(this);
        this.getSkillsTypeById = this.getSkillsTypeById.bind(this);
    }

    public getSkills(
        req: Request,
        res: Response,
        next: NextFunction
    ): Bluebird<Response> {
        return this.db.Skills.findAll({ attributes: ["id", "skill"] })
            .then(skills => apiResponse(res, { success: true, skills }, OK))
            .catch(error => {
                console.error(error);

                return apiResponse(
                    res,
                    {
                        success: false,
                        message: getStatusText(INTERNAL_SERVER_ERROR),
                    },
                    INTERNAL_SERVER_ERROR
                );
            });
    }

    public getSkillsTypeById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Bluebird<Response> {
        const { idSkill } = req.params;

        return this.db.SkillsType.findAll({
            attributes: ["id", "name"],
            where: { skillId: idSkill },
        })
            .then(skills => apiResponse(res, { success: true, skills }, OK))
            .catch(error => {
                console.error(error);

                return apiResponse(
                    res,
                    {
                        success: false,
                        message: getStatusText(INTERNAL_SERVER_ERROR),
                    },
                    INTERNAL_SERVER_ERROR
                );
            });
    }
}
