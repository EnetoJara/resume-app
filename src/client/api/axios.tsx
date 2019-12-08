import axios from "axios";
import { config } from "./api-config";

export class Axios {
    public constructor () {
        return axios.create({ ...config });
    }
}
