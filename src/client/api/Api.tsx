import { AxiosRequestConfig } from "axios";
import { Axios } from "./axios";

export class Api extends Axios {
    public requestMethod (config: AxiosRequestConfig) {
        console.log(this);
    }
}
