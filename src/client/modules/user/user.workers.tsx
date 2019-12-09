import { BAD_REQUEST } from "http-status-codes";
import { call, put } from "redux-saga/effects";
import { AppActions, RegisterCredentials, REGISTER_USER } from "resume-client";
import { registerUserFailed, registerUserSuccess } from "./user.actions";
import api from "./user.api";

export function* registerUserWorker (
    action: AppActions<REGISTER_USER, RegisterCredentials>
) {
    try {
        yield call(api.gestisterUser, action.payload);
        yield put(registerUserSuccess());
    } catch (error) {
        const parsed = error.status === BAD_REQUEST ? {...error.response.data} : {...error}
        yield put(registerUserFailed(parsed));
    }
}
