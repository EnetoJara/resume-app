import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface SocialMediaAttributes {
    name: string;
    url: string;
    icon: string;
}

export interface SocialMediaModel
    extends Model<SocialMediaAttributes>,
        SocialMediaAttributes {}

export type SocialMediaStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): SocialMediaModel;
};
export function SocialMediaFactory (sequelize: Sequelize) {
    return <SocialMediaStatic>sequelize.define("social_media", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
}
