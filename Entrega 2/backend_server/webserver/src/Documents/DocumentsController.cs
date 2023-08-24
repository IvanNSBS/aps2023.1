namespace webserver
{
    public class DocumentsController
    {
        // private readonly IDocumentsRepository _repo;
        private readonly IDocumentsRegister _register;

        public DocumentsController(IDocumentsRegister register)
        {
            _register = register;
        }

        public bool ChangeDocumentName(Document doc, string newName)
        {
            bool changedNames = _register.ChangeDocumentName(doc, newName);
            return changedNames;
        }

        public bool DeleteDocument(Document d)
        {
            return _register.DeleteDocument(d);
        }

        public string? GetDocumentContent(Document d)
        {
            string? content = _register.GetDocumentContent(d);
            return content;
        }

        public bool SaveDocument(Document d, string docContent)
        {
            bool stored = _register.UpdateDocumentContent(d, docContent);
            return stored;
        }
    }
}