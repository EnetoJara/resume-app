import {
    AppActions,
    LOGIN_USER,
    LOGIN_USER_FAILED,
    LOGIN_USER_SUCCESS,
    REGISTER_USER,
    REGISTER_USER_FAILED,
    REGISTER_USER_SUCCESS,
    UserState,
} from "../../../types/types";

export const initUser = Object.freeze<UserState>({
    id: "",
    email: "",
    name: "",
    lastName: "",
    token: "",
    success: false,
});

function login (state: UserState, action: AppActions): UserState {
    const { payload } = action;

    return {
        ...state,
        ...payload,
    };
}

export function userReducer (
    state: UserState = initUser,
    action: AppActions
): UserState {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state };
        case LOGIN_USER_SUCCESS:
            return login(state, action);
        case LOGIN_USER_FAILED:
            return { ...state };
        case REGISTER_USER:
            return { ...state };
        case REGISTER_USER_SUCCESS:
            return { ...state };
        case REGISTER_USER_FAILED:
            return { ...state };
        default:
            return { ...state };
    }
}
