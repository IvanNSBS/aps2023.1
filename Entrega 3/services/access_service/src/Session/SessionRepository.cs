using System;

namespace webserver
{
    public class SessionRepository : ISessionRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public SessionRepository(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Session CreateSession(User user)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                string uuid = Guid.NewGuid().ToString();
                Session session = new Session(uuid, user.Id);
                db.Sessions.Add(session);
                db.SaveChanges();

                return session;
            }
        }
        public bool DeleteSession(Session session)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Sessions.Remove(session);
                db.SaveChanges();
                return true;
            }
        }

        public Session? GetSession(SessionDTO session)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Session? s = db.Sessions.FirstOrDefault(x => x.Id == session.id );
                return s;
            }
        }
    }
}