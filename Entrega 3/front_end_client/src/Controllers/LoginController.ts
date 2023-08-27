import axios, {AxiosError} from "axios"
import ServicePorts from "../ServicePorts";
import { CurrentSession } from "../Data/CurrentSession";

export enum LoginStatus {
    SUCCESSFULL = 0,
    WRONG_USER_NAME_OR_PASSWORD = 1
}

export enum CreateUserStatus {
    SUCCESS = 0,
    EMAIL_ALREADY_REGISTERED = 1,
    OTHER_ERROR = 2
}

export type LoginOutput = {
    output: string;
    session: CurrentSession | undefined;
    loginStatus: LoginStatus;
}

export class LoginPresenter
{
    private url: string = `http://127.0.0.1:${ServicePorts.ACCESS_SERVICE}/accounts`

    public async attempt_login(email: string, password: string): Promise<LoginOutput> {
        const jsonData = {
            "email": email,
            "password": password
        }

        const endpoint = `${this.url}/login`; 
        try{
            const response = await axios.post(endpoint, jsonData);
            const session: CurrentSession = response.data;
            let output: LoginOutput = {
                output: "Logged In",
                session: session,
                loginStatus: LoginStatus.SUCCESSFULL 
            };

            console.log(output);
            return output;
        }
        catch(err){
            console.log(err);
            let output: LoginOutput = {
                output: "Wrong Username or Password",
                session: undefined,
                loginStatus: LoginStatus.WRONG_USER_NAME_OR_PASSWORD 
            };
            return output;
        }
    }

    public async attempt_create_user(email: string, username: string, password: string): Promise<CreateUserStatus>
    {
        try
        {
            const endpoint = `${this.url}/create_account`; 
            const jsonData = {
                "email": email,
                "username": username,
                "password": password
            }
            const res = await axios.post(endpoint, jsonData);
            return CreateUserStatus.SUCCESS;
        }
        catch(err:any)
        {
            const statusCode: number = err.response.status;
            console.log(statusCode);
            if(statusCode === 403)
                return CreateUserStatus.EMAIL_ALREADY_REGISTERED;

            return CreateUserStatus.OTHER_ERROR;
        }
    }
}
