using System;

namespace webserver
{    
    public interface IAccountsRepository
    {
        Account? GetUserAccount(string email);
        Account? GetUserFromAccountId(string id);
        bool AddUser(Account acc);
        bool DeleteUser(Account acc);
        bool UpdateUser(Account acc, string newEmail, string newUsername, string newPassword);
    }
}