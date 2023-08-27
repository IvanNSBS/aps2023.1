using System;

namespace webserver
{
    public class UsersRepository : IUsersRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public UsersRepository(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public User? GetUser(UserDTO user)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                User? u;
                if(string.IsNullOrEmpty(user.id))
                    u = db.Users.FirstOrDefault(x => x.UserEmail == user.email );
                else
                    u = db.Users.FirstOrDefault(x => x.Id == user.id );
                return u;
            }
        }

        public User AddUser(UserDTO account)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                string uuid = Guid.NewGuid().ToString();
                User u = new User(uuid, account.email, account.password);
                
                db.Users.Add(u);
                db.SaveChanges();
                return u;
            }
        }

        public bool UpdateUser(User acc, UserDTO newAcc)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var updateAcc = db.Users.Find(acc.Id);
                if(updateAcc != null)
                {
                    acc.UserEmail = newAcc.email;
                    acc.Password = newAcc.password;
                }
                db.SaveChanges();
                return true;
            }
        }
    }
}