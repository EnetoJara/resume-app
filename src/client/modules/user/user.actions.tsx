import { AxiosError } from "axios";
import { AppActions, RegisterCredentials, REGISTER_USER } from "../../../types/resume-client";

export function registerUser (
    user: RegisterCredentials
): AppActions<REGISTER_USER, RegisterCredentials> {
    return {
        type: REGISTER_USER,
        payload: user
    };
}

export type RegisterUser = typeof registerUser;

export function registerUserFailed (
    error: AxiosError
): AppActions<REGISTER_USER, AxiosError> {
    return {
        type: REGISTER_USER,
        payload: error
    };
}

export type RegisterUserFailed = typeof registerUserFailed;

export function registerUserSuccess (): AppActions<REGISTER_USER, null> {
    return {
        type: REGISTER_USER,
        payload: null
    };
}

export type RegisterUserSuccess = typeof registerUserSuccess;
