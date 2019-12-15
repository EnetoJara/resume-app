import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface GeneralAttributes {
    id: number;
    about: string;
    hasCar: boolean;
    isTraveler: boolean;
    from: string;
    birth: Date;
    children: number;
    city: string;
    state: string;
    gender: string;
    angaged: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface GeneralModel
    extends Model<GeneralAttributes>,
        GeneralAttributes {}

export type GeneralStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): GeneralModel;
};
export function GeneralFactory (sequelize: Sequelize) {
    return <GeneralStatic>sequelize.define("general", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        about: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "N/A",
        },
        hasCar: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isTraveler: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false,
        },
        birth: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        children: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "N/A",
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "N/A",
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "N/A",
        },
        angaged: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
