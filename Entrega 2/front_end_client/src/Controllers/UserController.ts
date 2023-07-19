import axios, {AxiosError} from "axios"

export class UserController
{
    private url: string = "http://127.0.0.1:5000/accounts"

    public async updateUserData(email: string, username: string, password: string): Promise<boolean>
    {
        try
        {
            const endpoint = `${this.url}/update_user_info`; 
            const jsonData = {
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
