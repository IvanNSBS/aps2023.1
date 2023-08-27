namespace webserver
{
    public interface ISessionRegistor
    {
        bool ValidateSession(SessionDTO session);
        User? GetSessionUser(SessionDTO session);
        Session CreateSession(User acc);
        void DeleteSession(Session session);
    }

    public class SessionRegistor : ISessionRegistor
    {
        private readonly ISessionRepository _repo;
        
        public SessionRegistor(ISessionRepository repo)
        {
            _repo = repo;
        }
        
        public bool ValidateSession(SessionDTO session)
        {
            return _repo.GetSession(session) != null;
        }

        public Session CreateSession(User user)
        {
            return _repo.CreateSession(user);
        }

        public void DeleteSession(Session session)
        {
            _repo.DeleteSession(session);
        }

        public User? GetSessionUser(SessionDTO session)
        {
            return _repo.GetSession(session)?.User;
        }
    }
}