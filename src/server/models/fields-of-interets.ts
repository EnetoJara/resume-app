import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface FieldsAttributes {
    field: string;
}

export interface FieldsModel
    extends Model<FieldsAttributes>,
        FieldsAttributes {}

export type FieldsStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): FieldsModel;
};
export function FieldsFactory (sequelize: Sequelize) {
    return <FieldsStatic>sequelize.define("fields", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        field: {
            type: DataTypes.STRING,
            unique: true,
        },
    });
}
