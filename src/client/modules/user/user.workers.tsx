import { CREATED } from "http-status-codes";
import { call, put } from "redux-saga/effects";
import { AppActions, RegisterCredentials, REGISTER_USER } from "resume-client";
import { registerUserFailed, registerUserSuccess } from "./user.actions";
import api from "./user.api";

export function* registerUserWorker (
    action: AppActions<REGISTER_USER, RegisterCredentials>
) {
    try {
        console.log(action.payload);
        const registered = yield call(api.userRegister, action.payload);
        console.log(registered);
        if (registered === CREATED) {
            yield put(registerUserSuccess());
        }
    } catch (error) {
        console.error(error);
        yield put(registerUserFailed(error));
    }
}
