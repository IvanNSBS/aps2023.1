using webserver;

public interface ISessionRepository
{
    Session CreateSession(User user);
    bool DeleteSession(Session session);
    Session? GetSession(SessionDTO session);
}