import { AppActions, UserState } from "resume-client";

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
        default:
            return { ...state };
    }
}
