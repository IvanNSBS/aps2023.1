import axios, {AxiosError} from "axios"

export type UserAccount = { 
    email: string,
    username: string,
    password: string,
}

export class UserController
{
    private url: string = "http://127.0.0.1:5000/accounts"

    public async updateUserData(userId: string, email: string, username: string, password: string): Promise<boolean>
    {
        try
        {
            const endpoint = `${this.url}/update_user_info`; 
            const jsonData = {
                "userId": userId,
                "email": email,
                "username": username,
                "password": password
            };
            const res = await axios.put(endpoint, jsonData);
            return true;
        }
        catch(err: any)
        {
            return false;
        }
    }

    public async getUserAccountInfo(userId: string): Promise<UserAccount | undefined> 
    {
        const endpoint = `${this.url}/get_user_info/${userId}`; 
        try
        {
            const res = await axios.get(endpoint);
            console.log(res);
            return res.data;
        }
        catch(err: any)
        {
            return undefined;
        }
    }

    public async deleteUser(userId: string): Promise<boolean>
    {
        const endpoint = `${this.url}/delete_user/${userId}`; 
        try
        {
            const res = await axios.delete(endpoint);
            return true;
        }
        catch(err: any)
        {
            return false;
        }
    }
}
