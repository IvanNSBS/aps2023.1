using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webserver
{
    public class Document
    {
        [Key]    
        public string Id { get; private set; }

        [Required]
        [MinLength(1)]
        public string DocumentName { get; private set; }
        public string? Content { get; private set; }
        public List<string>? LinkedDocuments { get; private set; }


        [ForeignKey("ProjectFK")]
        public Project Project { get; private set; } 
        public string ProjectFK { get; private set; }

        public Document(string id, string documentName, string? content, List<string>? linkedDocuments, string projectFK)
        {
            Id = id;
            DocumentName = documentName;
            Content = content;
            ProjectFK = projectFK;
            LinkedDocuments = linkedDocuments;
        }

        public Document(
            string id, string documentName, string? content, 
            List<string> linkedDocuments, Project project
            ) : this(id, documentName, content, linkedDocuments, project.Id)
        {
            Project = project;
        }
    }
}