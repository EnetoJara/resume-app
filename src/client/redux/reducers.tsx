import { combineReducers } from "redux";
import { userReducer } from "../modules/user/user.reducer";

export const rootReducer = combineReducers({ user: userReducer });
