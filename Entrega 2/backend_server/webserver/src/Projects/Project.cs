using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webserver
{
    public class Project
    {
        [Key]    
        public string Id { get; private set; }

        [Required]
        [MinLength(5, ErrorMessage = "This field must contain at minimum 5 characters")]
        [MaxLength(30, ErrorMessage = "This field must contain at most 30 characters")]
        public string ProjectName { get; set; }

        [ForeignKey("OwnerFK")]
        public Account Owner { get; private set; } 
        public string OwnerFK { get; private set; }

        public Project(string id, string projectName, string ownerFK)
        {
            Id = id;
            ProjectName = projectName;
            OwnerFK = ownerFK;
        }

        public Project(string id, string projectName, Account owner) : this(id, projectName, owner.Id)
        {
            Owner = owner;
        }
    }
}