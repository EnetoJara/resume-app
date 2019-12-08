import { fork, takeLatest } from "redux-saga/effects";
import { REGISTER_USER } from "../../../types/resume-client";
import { registerUserWorker } from "./user.workers";

function* registerUserWatcher () {
    yield takeLatest(REGISTER_USER, registerUserWorker);
}

export default [fork(registerUserWatcher)];
