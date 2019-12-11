import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface SkillsAttributes {
    skill: string;
}

export interface SkillsModel
    extends Model<SkillsAttributes>,
        SkillsAttributes {}

export type SkillsStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): SkillsModel;
};
export function SkillsFactory (sequelize: Sequelize) {
    return <SkillsStatic>sequelize.define("skills", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        skill: {
            type: DataTypes.STRING,
            unique: true,
        },
    });
}
