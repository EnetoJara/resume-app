import { Sequelize } from "sequelize";
import { CourseFactory, CourseStatic } from "./courses";
import { EducationFactory, EducationStatic } from "./education";
import { ExperienceFactory, ExperienceStatic } from "./experience";
import { FieldsFactory, FieldsStatic } from "./fields-of-interets";
import { GeneralFactory, GeneralStatic } from "./general";
import { SkillsFactory, SkillsStatic } from "./skills";
import { SkillsTypeFactory, SkillsTypeStatic } from "./skills-type";
import { SocialMediaFactory, SocialMediaStatic } from "./social-media";
import { UserFactory, UserStatic } from "./users";

export interface DB {
    sequelize: Sequelize;
    User: UserStatic;
    Skills: SkillsStatic;
    SkillsType: SkillsTypeStatic;
    Experience: ExperienceStatic;
    Education: EducationStatic;
    Course: CourseStatic;
    General: GeneralStatic;
    SocialMedia: SocialMediaStatic;
    FieldsOfInterest: FieldsStatic;
}

const sequelize = new Sequelize(
    (process.env.DB_NAME = "rest_resume_api"),
    (process.env.DB_USER = "john"),
    (process.env.DB_PASSWORD = "password"),
    {
        port: Number(process.env.DB_PORT) || 54320,
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    }
);

const User = UserFactory(sequelize);
const Skills = SkillsFactory(sequelize);
const SkillsType = SkillsTypeFactory(sequelize);
const Experience = ExperienceFactory(sequelize);
const Education = EducationFactory(sequelize);
const Course = CourseFactory(sequelize);
const General = GeneralFactory(sequelize);
const SocialMedia = SocialMediaFactory(sequelize);
const FieldsOfInterest = FieldsFactory(sequelize);

SkillsType.belongsTo(Skills);
SkillsType.belongsToMany(User, { through: "users_has_skills" });
User.belongsToMany(SkillsType, { through: "users_has_skills" });
Experience.belongsToMany(User, { through: "user_has_experience" });
User.belongsToMany(Experience, { through: "user_has_experience" });
Education.belongsToMany(User, { through: "user_has_education" });
User.belongsToMany(Education, { through: "user_has_education" });
Course.belongsTo(User);
General.belongsTo(User);
SocialMedia.belongsToMany(User, { through: "user_has_social" });
User.belongsToMany(SocialMedia, { through: "user_has_social" });
FieldsOfInterest.belongsToMany(User, { through: "user_has_fields" });
User.belongsToMany(FieldsOfInterest, { through: "user_has_fields" });

export const db: DB = {
    sequelize,
    User,
    Skills,
    SkillsType,
    Education,
    Experience,
    Course,
    General,
    SocialMedia,
    FieldsOfInterest,
};
