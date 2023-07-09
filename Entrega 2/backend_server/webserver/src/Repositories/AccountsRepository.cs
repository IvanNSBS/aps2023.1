using System;

namespace webserver
{
    public class AccountsRepository : IAccountsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public AccountsRepository(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public bool CreateUser(string email, string username, string password)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? account = db.Accounts.FirstOrDefault(x => x.UserEmail == email );
                if( account != null )
                    return false;

                string uuid = Guid.NewGuid().ToString();
                db.Accounts.Add(new Account(uuid, email, username, password));
                db.SaveChanges();

                return true;
            }
        }

        public string? ValidateUser(string email, string password)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? account = db.Accounts.FirstOrDefault(x => x.UserEmail == email );

                if(account == null)
                    return null;

                if(account.Password != password)
                    return null;

                return account.Id;
            }
        }
    }
}