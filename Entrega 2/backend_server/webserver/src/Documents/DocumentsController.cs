namespace webserver
{
    public class DocumentsController
    {
        private readonly IDocumentsRepository _repo;

        public DocumentsController(IDocumentsRepository repo)
        {
            _repo = repo;
        }

        public bool ChangeDocumentName(string documentId, string newName)
        {
            Document? d = _repo.GetDocument(documentId);
            if(d == null)
                return false;

            bool changedNames = _repo.ChangeDocumentName(d, newName);
            return changedNames;
        }

        public bool DeleteDocument(string documentId)
        {
            Document? d = _repo.GetDocument(documentId);
            if(d == null)
                return false;

            return _repo.DeleteDocument(d);
        }

        public string? GetDocumentContent(string documentId)
        {
            Document? d = _repo.GetDocument(documentId);
            if(d == null)
                return null;

            return d.Content;
        }

        public bool SaveDocument(string documentId, string docContent)
        {
            Document? d = _repo.GetDocument(documentId);
            if(d == null)
                return false;

            bool stored = _repo.UpdateDocumentContent(d, docContent);
            return stored;
        }
    }
}