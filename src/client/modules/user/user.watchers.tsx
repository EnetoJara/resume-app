import { fork, takeEvery } from "redux-saga/effects";
import { REGISTER_USER } from "../../../types/resume-client";
import { registerUserWorker } from "./user.workers";

function* registerUserWatcher () {
    yield takeEvery(REGISTER_USER, registerUserWorker);
}

export default [fork(registerUserWatcher)];
