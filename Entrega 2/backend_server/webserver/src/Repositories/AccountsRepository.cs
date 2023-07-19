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

        public bool DeleteUser(string userId)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? account = db.Accounts.FirstOrDefault(x => x.Id == userId);
                if(account == null)
                    return false;

                Project[] userProjects = db.Projects.Where(x => x.OwnerFK == userId).ToArray();
                foreach(Project project in userProjects)
                {
                    Document[] projectDocs = db.Documents.Where(x => x.ProjectFK == project.Id).ToArray();
                    foreach(Document doc in projectDocs)
                        db.Documents.Remove(doc);

                    db.Projects.Remove(project);
                }

                db.Accounts.Remove(account);
                db.SaveChanges();
                return true;
            }
        }

        public AccountInfo? GetAccountInfo(string accountId)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? account = db.Accounts.FirstOrDefault(x => x.Id == accountId);
                if(account == null)
                    return null;

                return new AccountInfo {
                    email=account.UserEmail, 
                    username=account.Username, 
                    password=account.Password 
                };
            }
        }

        public bool UpdateUser(string userId, string newEmail, string newUsername, string newPassword)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? account = db.Accounts.FirstOrDefault(x => x.Id == userId );
                if( account == null ){
                    Console.WriteLine($"account not found for {userId}");
                    return false;
                }

                account.UserEmail = newEmail;
                account.Username = newUsername;
                account.Password = newPassword;
                db.SaveChanges();
                return true;
            }
        }
    }
}