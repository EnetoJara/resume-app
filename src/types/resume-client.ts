declare module "resume-client" {
    import { AxiosPromise, AxiosRequestConfig } from "axios";
    import { Action } from "redux";

    interface AppActions<T = string, P = any> extends Action {
        type: T;
        payload: P;
    }

    type RequestMethod = <T = any>(
        config: AxiosRequestConfig
    ) => AxiosPromise<T>;

    interface UserState {
        id: string;
        email: string;
        name: string;
        lastName: string;
        token: string;
    }

    interface AppState {
        user: UserState;
    }

    interface RegisterCredentials {
        email: string;
        name: string;
        middleName: string;
        lastName: string;
        secondLastName: string;
        password: string;
        password2: string;
    }

    interface LoginCredentials {
        email: string;
        password: string;
    }

    interface PostMethod {
        <T, P>(url: string, data: T, config?: AxiosRequestConfig): AxiosPromise<
            P
        >;
    }

    const REGISTER_USER = "user/register";
    type REGISTER_USER = typeof REGISTER_USER;
    const LOGIN_USER = "user/login";
    type LOGIN_USER = typeof LOGIN_USER;
}
