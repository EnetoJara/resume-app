import { BAD_REQUEST } from "http-status-codes";
import { call, put } from "redux-saga/effects";
import {
    AppActions,
    LoginCredentials,
    LOGIN_USER,
    RegisterCredentials,
    REGISTER_USER,
} from "../../../types/types";
import {
    loginUserFailed,
    loginUserSuccess,
    registerUserFailed,
    registerUserSuccess,
} from "./user.actions";
import api from "./user.api";

export function* registerUserWorker (
    action: AppActions<REGISTER_USER, RegisterCredentials>
) {
    console.log("registerUserWorker");
    try {
        yield call(api.registerUser, action.payload);
        yield put(registerUserSuccess());
    } catch (error) {
        const parsed =
            error.status === BAD_REQUEST
                ? { ...error.response.data }
                : { ...error };
        yield put(registerUserFailed(parsed));
    }
}

export function* loginUserWorker (
    credentials: AppActions<LOGIN_USER, LoginCredentials>
) {
    console.log("loginUserWorker");
    try {
        const { payload } = credentials;
        const user = yield call(api.loginUser, payload);
        yield put(loginUserSuccess(user));
    } catch (error) {
        yield put(loginUserFailed(error));
    }
}
