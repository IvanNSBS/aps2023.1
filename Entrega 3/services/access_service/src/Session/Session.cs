using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webserver
{
    public class Session
    {
        [Key]    
        public string Id { get; set; }

        [ForeignKey("UserFK")]
        public User User { get; private set; } 
        public string UserFK { get; private set; }

        public Session(string id, string userFK)
        {
            Id = id;
            UserFK = userFK;
        }

        public Session(string id, User user) : this(id, user.Id)
        {
            this.User = user;
        }
    }
}