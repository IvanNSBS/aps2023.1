namespace webserver
{
    public interface IAccountsRegister
    {
        Account? GetUserFromAccountId(string accId);
        bool DeleteUser(Account acc);
        void CreateUser(Account acc);
        bool UpdateUser(Account old, Account @new);
        bool IsEmailRegistered(Account acc);
        bool IsPasswordCorrect(Account acc);
        bool UserExists(Account acc);
        string? GetAccountId(Account acc);
    }

    public class AccountsRegister : IAccountsRegister
    {
        private readonly IAccountsRepository _repo;
        
        public AccountsRegister(IAccountsRepository repo)
        {
            _repo = repo;
        }

        public Account? GetUserFromAccountId(string accId)
        {
            return _repo.GetUserFromAccountId(accId);
        }

        public string? GetAccountId(Account acc)
        {
            return _repo.GetUserAccount(acc.UserEmail)?.Id;
        }

        public bool DeleteUser(Account acc)
        {
            return _repo.DeleteUser(acc);
        }

        public void CreateUser(Account acc)
        {
            acc.Id = Guid.NewGuid().ToString();
            _repo.AddUser(acc);
        }

        public bool UpdateUser(Account old, Account @new)
        {
            return _repo.UpdateUser(old, @new);
        }

        public bool IsEmailRegistered(Account acc)
        {
            return _repo.GetUserAccount(acc.UserEmail) != null;
        }

        public bool IsPasswordCorrect(Account acc)
        {
            string? password = _repo.GetUserAccount(acc.UserEmail)?.Password;
            if(password == null)
                return false;

            return password == acc.Password;
        }

        public bool UserExists(Account acc)
        {
            if(!string.IsNullOrEmpty(acc.Id))
                return _repo.GetUserFromAccountId(acc.Id) != null;
            else if(!string.IsNullOrEmpty(acc.UserEmail))
                return _repo.GetUserAccount(acc.UserEmail) != null;

            return false;
        }
    }
}