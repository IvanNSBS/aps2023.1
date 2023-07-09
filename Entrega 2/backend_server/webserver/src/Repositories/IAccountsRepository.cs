using System;

namespace webserver
{
    public interface IAccountsRepository
    {
        bool CreateUser(string email, string username, string password);
        string? ValidateUser(string userEmail, string password);
    }
}