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

        public Account? GetUserAccount(string email)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? account = db.Accounts.FirstOrDefault(x => x.UserEmail == email );
                return account;
            }
        }

        public Account? GetUserFromAccountId(string id)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? account = db.Accounts.FirstOrDefault(x => x.Id == id );
                return account;
            }
        }


        public bool AddUser(Account account)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Accounts.Add(account);
                db.SaveChanges();
                return true;
            }
        }

        public bool DeleteUser(Account acc)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Project[] userProjects = db.Projects.Where(x => x.OwnerFK == acc.Id).ToArray();
                foreach(Project project in userProjects)
                {
                    Document[] projectDocs = db.Documents.Where(x => x.ProjectFK == project.Id).ToArray();
                    foreach(Document doc in projectDocs)
                        db.Documents.Remove(doc);

                    db.Projects.Remove(project);
                }

                db.Accounts.Remove(acc);
                db.SaveChanges();
                return true;
            }
        }

        public bool UpdateUser(Account acc, string newEmail, string newUsername, string newPassword)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var updateAcc = db.Accounts.Find(acc.Id);
                if(updateAcc != null)
                {
                    acc.UserEmail = newEmail;
                    acc.Username = newUsername;
                    acc.Password = newPassword;
                }
                db.SaveChanges();
                return true;
            }
        }
    }
}