import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface CourseAttributes {
    giver: string;
    name: string;
    from: Date;
    to: Date;
    certificationId: string;
}

export interface CourseModel
    extends Model<CourseAttributes>,
        CourseAttributes {}

export type CourseStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): CourseModel;
};

export function CourseFactory (sequelize: Sequelize) {
    return <CourseStatic>sequelize.define("courses", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        certificationId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        giver: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        from: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        to: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
}
