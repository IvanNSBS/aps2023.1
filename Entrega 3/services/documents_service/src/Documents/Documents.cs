using System.ComponentModel.DataAnnotations;

namespace webserver
{
    public class Document
    {
        [Key]    
        public string Id { get; private set; }

        [Required]
        [MinLength(1)]
        public string DocumentName { get; set; }
        public string? Content { get; set; }

        [Required]
        public string ProjectId { get; private set; }

        public Document(string id, string documentName, string? content, string projectId)
        {
            Id = id;
            DocumentName = documentName;
            Content = content;
            ProjectId = projectId;
        }
    }
}