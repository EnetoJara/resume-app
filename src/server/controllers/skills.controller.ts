import { NextFunction, Request, Response } from "express";
import { getStatusText, INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import { SkillsService } from "../services";
import {
    apiResponse,
    failedResponse,
    successResponse,
} from "../utils/response";
import { isNumber } from "../utils/validator";
import { logger } from "../utils/logger";

/**
 * @description Skills controller
 * @class
 * @public
 * @author Ernesto Jara Olveda
 */
export class SkillsController {
    private skillsService: SkillsService;

    /**
     * @description Creates an instance of skills controller.
     * @author `Ernesto Jara Olveda`
     * @constructor
     * @param {SkillsService} skillsService
     */
    public constructor (skillsService: SkillsService) {
        /**
         * @description Skills serviced of skills controller
         * @private
         * @type {SkillsService}
         * @memberof {SkillsController}
         */
        this.skillsService = skillsService;

        this.getSkills = this.getSkills.bind(this);
        this.getSkillsTypeById = this.getSkillsTypeById.bind(this);
    }

    /**
     * Gets all skills
     * @public
     * @Get
     * @async
     * @method {getSkills}
     * @author Ernesto Jara Olveda
     * @memberof {SkillsController}
     * @param {Request} `req`
     * @param {Response} `res`
     * @param {NextFunction} `next`
     * @returns {Promise<Response>} `array` with all skills
     */
    public async getSkills (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> {
        logger.info("getSkills");
        try {
            const skills = await this.skillsService.getAll();

            return apiResponse(res, successResponse(skills), OK);
        } catch (error) {
            logger.error("error while getting skills", { meta: { ...error } });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Gets the skills types by skill id
     * @public
     * @Get
     * @async
     * @method {getSkills}
     * @author Ernesto Jara Olveda
     * @memberof {SkillsController}
     * @param {Request} `req`
     * @param {Response} `res`
     * @param {NextFunction} `next`
     * @returns {Promise<Response>} `array` with all skills
     */
    public async getSkillsTypeById (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> {
        logger.info("getSkillsTypeById");
        try {
            const idSkill = req.params[`${process.env.ROUTE_PARAM_SKILL}`];
            const criteria = isNumber(idSkill) ? idSkill : 0;
            const types = await this.skillsService.getSkillsByType(
                Number(criteria)
            );

            return apiResponse(res, successResponse(types), OK);
        } catch (error) {
            logger.error("error while getting skills types by id", {
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
