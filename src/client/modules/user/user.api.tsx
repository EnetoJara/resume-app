import { AxiosError, AxiosResponse } from "axios";
import { LoginCredentials, RegisterCredentials, UserState } from "../../../types/resume-client";
import { Api } from "../../api";

class UserApi extends Api {
    public constructor () {
        super();
        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }
    public registerUser (user: RegisterCredentials): Promise<number> {
        return this.requestMethod({
            method: POST,
            url: "/api/v1/register",
            data: JSON.stringify(user),
        })
            .then((res: AxiosResponse<number>) => {
                return res.status;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public loginUser (user: LoginCredentials): Promise<UserState> {
        return this.requestMethod({
            method: POST,
            url: "/api/v1/register",
            data: JSON.stringify(user),
        })
            .then((res: AxiosResponse<UserState>) => {
                return res.status;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }
}

export default new UserApi();
