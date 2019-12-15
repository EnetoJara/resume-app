import { Router } from "express";
import { SkillsController, UserController } from "../controllers";
import { DB } from "../models/index";
import { SkillsService, UserService } from "../services";
import { validateRegister, validatingLogin } from "../utils/middlewares";

export function routes (db: DB) {
    const api = Router();

    const userController = new UserController(new UserService(db));
    const skillsController = new SkillsController(new SkillsService(db));

    api.post(
        `/${process.env.ROUTE_REGISTER}`,
        [validateRegister],
        userController.register
    );
    api.post(
        `/${process.env.ROUTE_LOGIN}`,
        [validatingLogin],
        userController.login
    );
    api.get(`/${process.env.ROUTE_GET_ALL_USERS}`, userController.getAllUsers);
    api.get(`/${process.env.ROUTE_GET_SKILLS}`, skillsController.getSkills);
    api.get(
        `/${process.env.ROUTE_GET_SKILL_TYPE_BY_ID}/:${process.env.ROUTE_PARAM_SKILL}`,
        skillsController.getSkillsTypeById
    );

    return api;
}
