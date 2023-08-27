using System.ComponentModel.DataAnnotations;

namespace webserver
{
    public class User
    {
        [Key]    
        public string Id { get; set; }

        [Required]
        public string UserEmail { get; set; }

        [Required]
        [MinLength(5, ErrorMessage = "This field must contain at minimum 5 characters")]
        public string Password { get; set; }

        public User(string id, string userEmail,string password)
        {
            Id = id;
            UserEmail = userEmail;
            Password = password;
        }
    }
}