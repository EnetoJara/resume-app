import Bluebird from "bluebird";
import { DB } from "../models";
import { SkillsModel } from "../models/skills";
import { SkillsTypeModel } from "../models/skills-type";

/**
 * @description Skills service
 * @class
 * @public
 * @author `Ernesto Jara Olveda`
 */
export class SkillsService {
    /**
     * @description Db of skills service
     * @type {DB}
     */
    private db: DB;

    /**
     * Creates an instance of skills service.
     * @author `Ernesto Jara Olveda`
     * @constructor
     * @param {DB} `db`
     */
    public constructor (db: DB) {
        this.db = db;
        this.getAll = this.getAll.bind(this);
        this.getSkillsByType = this.getSkillsByType.bind(this);
    }

    /**
     * Gets skills
     * @public
     * @method {getSkillsByType}
     * @author Ernesto Jara Olveda
     * @memberof {SkillsService}
     * @param {number} idSkills
     * @returns {SkillsTypeModel[]} skills by type
     */
    public getAll (): Bluebird<SkillsModel[]> {
        return this.db.Skills.findAll({ attributes: ["id", "skill"] }).then(
            (res: SkillsModel[]) => {
                return res;
            }
        );
    }

    /**
     * Gets all skills type by skills id
     * @public
     * @method {getSkillsByType}
     * @author Ernesto Jara Olveda
     * @memberof {SkillsService}
     * @param {number} idSkills
     * @returns {SkillsTypeModel[]} skills by type
     */
    public getSkillsByType (idSkills: number): Bluebird<SkillsTypeModel[]> {
        return this.db.SkillsType.findAll({
            attributes: ["id", "name"],
            where: { skillId: idSkills },
        }).then((skills: SkillsTypeModel[]) => {
            return skills;
        });
    }
}
