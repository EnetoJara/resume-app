import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface SkillsTypeAttributes {
    name: string;
}

export interface SkillsTypeModel
    extends Model<SkillsTypeAttributes>,
        SkillsTypeAttributes {}

export type SkillsTypeStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): SkillsTypeModel;
};

export function SkillsTypeFactory (sequelize: Sequelize) {
    return <SkillsTypeStatic>sequelize.define("skills_types", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
}
