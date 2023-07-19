import axios, {AxiosError} from "axios"

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
    loginStatus: LoginStatus;
}

export class LoginController
{
    private url: string = "http://127.0.0.1:5000/accounts"

    public async attempt_login(email: string, password: string): Promise<LoginOutput> {
        const jsonData = {
            "email": email,
            "password": password
        }

        const endpoint = `${this.url}/login`; 
        try{
            const {data} = await axios.post(endpoint, jsonData);
            let output: LoginOutput = {
                output: data,
                loginStatus: LoginStatus.SUCCESSFULL 
            };
            return output;
        }
        catch(err){
            let output: LoginOutput = {
                output: "Wrong Username or Password",
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
            // console.log(error.response.status);
        }
    }
}
