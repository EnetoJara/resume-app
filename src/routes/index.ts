import { Router } from "express";
import { SkillsController } from "../controllers/skills.controller";
import { UserController } from "../controllers/user.controller";
import { DB } from "../models/index";

export function routes(db: DB) {
    const api = Router();

    const userController = new UserController(db);
    const skillsController = new SkillsController(db);

    api.post("/v1/register", userController.register);
    api.post("/v1/login", userController.login);
    api.get("/v1/users", userController.getAllUsers);
    api.get("/v1/skills", skillsController.getSkills);
    api.get("/v1/skills/:idSkill", skillsController.getSkillsTypeById);

    return api;
}
