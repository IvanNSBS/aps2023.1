namespace webserver
{
    public interface IDocumentsRegister
    {
        bool ChangeDocumentName(Document d, string newName);
        bool DeleteDocument(Document d);
        string? GetDocumentContent(Document d);
        bool UpdateDocumentContent(Document d, string newContent);
    }

    public class DocumentsRegister : IDocumentsRegister
    {
        private readonly IDocumentsRepository _repo;
        
        public DocumentsRegister(IDocumentsRepository repo)
        {
            _repo = repo;
        }

        public bool ChangeDocumentName(Document d, string newName)
        {
            return _repo.ChangeDocumentName(d, newName);
        }

        public bool DeleteDocument(Document d)
        {
            return _repo.DeleteDocument(d);
        }

        public string? GetDocumentContent(Document d)
        {
            return _repo.GetDocument(d.Id)?.Content;
        }

        public bool UpdateDocumentContent(Document d, string newContent)
        {
            return _repo.UpdateDocumentContent(d, newContent);
        }
    }
}