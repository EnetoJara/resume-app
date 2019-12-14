import { AxiosRequestConfig } from "axios";
import { Axios } from "./axios";

export class Api extends Axios {
    public requestMethod (config: AxiosRequestConfig) {
        return this.api(config);
    }
}
