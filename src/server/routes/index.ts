import { Router } from "express";
import { SkillsController } from "../controllers/skills.controller";
import { UserController } from "../controllers/user.controller";
import { DB } from "../models/index";

export function routes (db: DB) {
    const api = Router();

    const userController = new UserController(db);
    const skillsController = new SkillsController(db);

    api.post(process.env.ROUTE_REGISTER || "", userController.register);
    api.post(process.env.ROUTE_LOGIN || "", userController.login);
    api.get(process.env.ROUTE_GET_ALL_USERS || "", userController.getAllUsers);
    api.get(process.env.ROUTE_GET_SKILLS || "", skillsController.getSkills);
    api.get(
        process.env.ROUTE_GET_SKILL_TYPE_BY_ID || "",
        skillsController.getSkillsTypeById
    );

    return api;
}
