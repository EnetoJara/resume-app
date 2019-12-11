import { AxiosPromise, AxiosRequestConfig } from "axios";
import { Action } from "redux";

export interface AppActions<T = string, P = any> extends Action {
    type: T;
    payload: P;
}

export type RequestMethod = <T = any>(
    config: AxiosRequestConfig
) => AxiosPromise<T>;

export interface UserState {
    id: string;
    email: string;
    name: string;
    lastName: string;
    token: string;
}

export interface AppState {
    user: UserState;
}

export interface RegisterCredentials {
    email: string;
    name: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    password: string;
    password2: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface PostMethod {
    <T, P>(url: string, data: T, config?: AxiosRequestConfig): AxiosPromise<P>;
}

export const LOGIN_USER = "user/login";
export type LOGIN_USER = typeof LOGIN_USER;

export const LOGIN_USER_SUCCESS = "user/login-success";
export type LOGIN_USER_SUCCESS = typeof LOGIN_USER_SUCCESS;

export const LOGIN_USER_FAILED = "user/login-failed";
export type LOGIN_USER_FAILED = typeof LOGIN_USER_FAILED;

export const REGISTER_USER = "user/register";
export type REGISTER_USER = typeof REGISTER_USER;

export const REGISTER_USER_SUCCESS = "user/register-success";
export type REGISTER_USER_SUCCESS = typeof REGISTER_USER_SUCCESS;

export const REGISTER_USER_FAILED = "user/register-failed";
export type REGISTER_USER_FAILED = typeof REGISTER_USER_FAILED;
