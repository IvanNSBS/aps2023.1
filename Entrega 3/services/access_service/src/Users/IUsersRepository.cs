using System;

namespace webserver
{    
    public interface IUsersRepository
    {
        User? GetUser(UserDTO user);
        User AddUser(UserDTO acc);
        bool UpdateUser(User acc, UserDTO newData);
    }
}