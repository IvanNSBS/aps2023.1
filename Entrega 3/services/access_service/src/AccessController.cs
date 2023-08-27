namespace webserver
{
    public class AccessController
    {
        private readonly IUsersRegistor _usersRegistor;
        private readonly ISessionRegistor _sessionRegistor;

        public AccessController(IUsersRegistor users, ISessionRegistor session)
        {
            _usersRegistor = users;
            _sessionRegistor = session;
        }

        public User? CreateAccount(UserDTO user)
        {
            bool emailIsUsed = _usersRegistor.GetUser(user) != null;
            if(emailIsUsed)
                return null;

            return _usersRegistor.CreateUser(user);
        }

        public Session? Login(UserDTO userDTO)
        {
            User? u = _usersRegistor.GetUser(userDTO);
            bool incorrectEmail = u == null;
            if(incorrectEmail)
                return null;

            bool incorrectPassword = u.Password != userDTO.password;
            if(incorrectPassword)
                return null;

            Session session = _sessionRegistor.CreateSession(u);
            return session;
        }

        public bool UpdateUserInfo(UserDTO oldUser, UserDTO newUser)
        {
            _usersRegistor.UpdateUser(oldUser, newUser);
            return true;
        }
    }
}