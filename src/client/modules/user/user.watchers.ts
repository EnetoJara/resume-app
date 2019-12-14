import { fork, takeEvery } from "redux-saga/effects";
import { LOGIN_USER, REGISTER_USER } from "../../../types/types";
import { loginUserWorker, registerUserWorker } from "./user.workers";

function* registerUserWatcher () {
    yield takeEvery(REGISTER_USER, registerUserWorker);
}

function* loginUserWatcher () {
    yield takeEvery(LOGIN_USER, loginUserWorker);
}

export default [fork(registerUserWatcher), fork(loginUserWatcher)];
