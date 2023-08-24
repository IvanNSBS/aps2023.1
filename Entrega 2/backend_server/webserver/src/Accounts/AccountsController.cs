using Newtonsoft.Json;

namespace webserver
{
    public class AccountsController
    {
        // private readonly IAccountsRepository _repo;
        private readonly IAccountsRegister _register;

        public AccountsController(IAccountsRegister register)
        {
            _register = register;
        }

        public Account? GetAccount(string userId)
        {
            return _register.GetUserFromAccountId(userId);
        }

        public bool CreateAccount(Account acc)
        {
            bool used = _register.IsEmailRegistered(acc);
            if(used)
                return false;

            _register.CreateUser(acc);
            return true;
        }

        public string? ValidateLogin(Account acc)
        {
            bool correctEmail = _register.IsEmailRegistered(acc);
            if(!correctEmail)
                return null;

            bool passwordCorrect = _register.IsPasswordCorrect(acc);
            if(!passwordCorrect)
                return null;

            string? id = _register.GetAccountId(acc);
            return id;
        }

        public bool DeleteUser(Account acc)
        {
            bool exists = _register.UserExists(acc);
            if (!exists)
                return false;

            return _register.DeleteUser(acc);
        }

        public string? GetUserInfoJson(string userId)
        {
            Account? user = _register.GetUserFromAccountId(userId);
            if(user == null)
                return null;
        
            AccountInfo info = new AccountInfo {
                email=user.UserEmail, 
                username=user.Username, 
                password=user.Password 
            };

            string accInfoJson = JsonConvert.SerializeObject(info);
            return accInfoJson;
        }

        public bool UpdateUserInfo(Account oldUser, Account newUser)
        {
            _register.UpdateUser(oldUser, newUser);
            return true;
        }
    }
}