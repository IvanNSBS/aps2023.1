using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webserver
{
    public class Account
    {
        [Key]    
        public string Id { get; private set; }

        [Required]
        public string UserEmail { get; private set; }

        [Required]
        [MinLength(5, ErrorMessage = "This field must contain at minimum 5 characters")]
        public string Username { get; private set; }

        [Required]
        [MinLength(5, ErrorMessage = "This field must contain at minimum 5 characters")]
        public string Password { get; private set; }

        public Account(string id, string userEmail, string username, string password)
        {
            Id = id;
            UserEmail = userEmail;
            Username = username;
            Password = password;
        }
    }
}