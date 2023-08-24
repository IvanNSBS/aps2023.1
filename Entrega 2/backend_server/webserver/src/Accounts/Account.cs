using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webserver
{
    public class Account
    {
        [Key]    
        public string Id { get; set; }

        [Required]
        public string UserEmail { get; set; }

        [Required]
        [MinLength(5, ErrorMessage = "This field must contain at minimum 5 characters")]
        public string Username { get; set; }

        [Required]
        [MinLength(5, ErrorMessage = "This field must contain at minimum 5 characters")]
        public string Password { get; set; }

        public Account(string id, string userEmail, string username, string password)
        {
            Id = id;
            UserEmail = userEmail;
            Username = username;
            Password = password;
        }
    }
}