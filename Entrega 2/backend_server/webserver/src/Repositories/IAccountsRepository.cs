using System;

namespace webserver
{
    public struct AccountInfo
    {
        public string email, username, password;
    }
    
    public interface IAccountsRepository
    {
        bool CreateUser(string email, string username, string password);
        string? ValidateUser(string userEmail, string password);
        AccountInfo? GetAccountInfo(string accountId);
        bool DeleteUser(string userId);
        bool UpdateUser(string userId, string newEmail, string newUsername, string newPassword);
    }
}