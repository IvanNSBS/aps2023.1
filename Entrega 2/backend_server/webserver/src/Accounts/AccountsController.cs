using Newtonsoft.Json;

namespace webserver
{
    public class AccountsController
    {
        private readonly IAccountsRepository _repo;

        public AccountsController(IAccountsRepository repo)
        {
            _repo = repo;
        }

        public Account? GetAccount(string userId)
        {
            return _repo.GetUserFromAccountId(userId);
        }

        public bool CreateAccount(string email, string username, string password)
        {
            bool exists = _repo.GetUserAccount(email) != null;
            if(exists)
                return false;

            string uuid = Guid.NewGuid().ToString();
            Account acc = new(uuid, email, username, password);
            _repo.AddUser(acc);
            return true;
        }

        public string? ValidateLogin(string email, string password)
        {
            Account? user = _repo.GetUserAccount(email);
            if(user == null)
                return null;

            bool valid = user.Password == password;
            if(!valid)
                return "";

            return user.Id;
        }

        public bool DeleteUser(string userId)
        {
            Account? user = _repo.GetUserFromAccountId(userId);
            if(user == null)
                return false;

            return _repo.DeleteUser(user);
        }

        public string? GetUserInfoJson(string userId)
        {
            Account? user = _repo.GetUserFromAccountId(userId);
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

        public bool UpdateUserInfo(string userId, string email, string username, string password)
        {
            Account? user = _repo.GetUserFromAccountId(userId);
            if(user == null)
                return false;

            _repo.UpdateUser(user, email, username, password);
            return true;
        }
    }
}