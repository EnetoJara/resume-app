import axios, { AxiosError, AxiosResponse } from "axios";
import { RegisterCredentials } from "resume-client";

class UserApi {
    public userRegister (user: RegisterCredentials) {
        const instance = axios.create();
        instance.defaults.headers.common["Access-Control-Allow-Origin"] = "http://localhost:3000";
        instance.defaults.headers.common["Accept"]="application/json";
        instance.defaults.baseURL = "http://localhost:3001";
        instance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        return instance.post<RegisterCredentials, AxiosResponse<number>>("/api/v1/register", JSON.stringify({
            ...user
        })).then((res: AxiosResponse) => res.status).catch((error: AxiosError) => {
            throw error;
        });
    }
}

export default new UserApi();
