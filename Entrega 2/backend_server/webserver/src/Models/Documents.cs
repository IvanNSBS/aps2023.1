using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webserver
{
    public class Document
    {
        [Key]    
        public string Id { get; private set; }

        public string? Content { get; private set; }

        public Document(string id, string? content)
        {
            Id = id;
            Content = content;
        }
    }
}