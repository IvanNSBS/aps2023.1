namespace webserver
{
    public interface IUsersRegistor
    {
        User? GetUser(UserDTO user);
        User CreateUser(UserDTO user);
        bool UpdateUser(UserDTO old, UserDTO @new);
    }

    public class UsersRegistor : IUsersRegistor
    {
        private readonly IUsersRepository _repo;
        
        public UsersRegistor(IUsersRepository repo)
        {
            _repo = repo;
        }

        public User CreateUser(UserDTO user)
        {
            return _repo.AddUser(user);
        }

        public User? GetUser(UserDTO user)
        {
            return _repo.GetUser(user);
        }

        public bool UpdateUser(UserDTO old, UserDTO @new)
        {
            User? u = _repo.GetUser(old);
            if(u == null)
                return false;

            return _repo.UpdateUser(u, @new);
        }
    }
}