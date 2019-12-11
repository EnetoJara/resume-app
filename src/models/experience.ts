import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface ExperienceAttributes {
    id: number;
    role: string;
    project: string;
    description: string;
    directBossName: string;
    directBossEmail: string;
    directBossPhone: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ExperienceModel
    extends Model<ExperienceAttributes>,
        ExperienceAttributes {}

export type ExperienceStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ExperienceModel;
};

export function ExperienceFactory (sequelize: Sequelize) {
    return <ExperienceStatic>sequelize.define("experiences", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        project: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isCurrent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        directBossName: {
            type: DataTypes.STRING,
            defaultValue: "Not Provided",
        },
        directBossEmail: {
            type: DataTypes.STRING,
            defaultValue: "Not Provided",
        },
        directBossPhone: {
            type: DataTypes.STRING,
            defaultValue: "Not Provided",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
}
