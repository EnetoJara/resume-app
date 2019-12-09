import { AxiosError, AxiosResponse } from "axios";
import { RegisterCredentials } from "resume-client";
import { Api } from "../../api/Api";

class UserApi extends Api {
    public constructor () {
        super();
        this.gestisterUser = this.gestisterUser.bind(this);
    }
   public gestisterUser (user: RegisterCredentials): Promise<number> {
       console.log({...this});
        return this.requestMethod({
            method: "post",
            url: "/api/v1/register",
            data: JSON.stringify(user)
        }).then((res: AxiosResponse<number>) => {
            return res.status
        }).catch((error: AxiosError) => {
            throw error;
        });
   }
}

export default new UserApi();
