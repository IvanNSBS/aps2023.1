import axios from "axios"

export enum LoginStatus {
    SUCCESSFULL = 0,
    WRONG_USER_NAME_OR_PASSWORD = 1
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
}
