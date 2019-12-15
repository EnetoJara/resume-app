import { all } from "redux-saga/effects";
import userWatchers from "./user/user.watchers";

export default function* rootSagas () {
    yield all([...userWatchers]);
}
