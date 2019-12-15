import axios, { AxiosInstance } from "axios";
import { config } from "./api-config";

export class Axios {
    public api: AxiosInstance;

    public constructor () {
        this.api = axios.create({ ...config });
    }
}
