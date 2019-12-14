import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface EducationAttributes {
    id: number;
    subject: string;
    institute: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface EducationModel
    extends Model<EducationAttributes>,
        EducationAttributes {}

export type EducationStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): EducationModel;
};

export function EducationFactory (sequelize: Sequelize) {
    return <EducationStatic>sequelize.define("educations", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        institute: {
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
