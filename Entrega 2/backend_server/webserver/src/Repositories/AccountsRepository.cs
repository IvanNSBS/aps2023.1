using System;

namespace webserver
{
    public interface IAccountsRepository
    {
        string[] GetAllUsernames();
        void AddUser(string username, string password);
    }

    public class AccountsRepository : IAccountsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public AccountsRepository(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public string[] GetAllUsernames()
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return db.Accounts.Select(x => x.Username).ToArray();
            }
        }

        public void AddUser(string username, string password)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                string uuid = Guid.NewGuid().ToString();
                db.Accounts.Add(new Account(uuid, username, password));
                db.SaveChanges();
            }
        }
    }
}