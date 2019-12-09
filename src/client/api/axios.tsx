import axios, { AxiosInstance } from "axios";
import { config } from "./api-config";

export class Axios {
    api: AxiosInstance;
    public constructor () {
        this.api = axios.create({ ...config });
    }
}
