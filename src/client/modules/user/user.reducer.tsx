import { AppActions, REGISTER_USER, REGISTER_USER_FAILED, REGISTER_USER_SUCCESS, UserState } from "../../../types/resume-client";
export const initUser = Object.freeze<UserState>({
    id: "",
    email: "",
    name: "",
    lastName: "",
    token: ""
});

export function userReducer (
    state: UserState = initUser,
    action: AppActions
): UserState {
    switch (action.type) {
        case REGISTER_USER:
            return {...state};
        case REGISTER_USER_SUCCESS:
            return {...state};
        case REGISTER_USER_FAILED:
            return {...state};
        default:
            return { ...state };
    }
}
