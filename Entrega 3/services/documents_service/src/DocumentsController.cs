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

        public Document? CreateDocument(ProjectDTO project, string docName)
        {
            return _register.CreateDocument(project, docName);
        }

        public Document[] GetProjectDocuments(ProjectDTO project)
        {
            return _register.GetProjectDocuments(project);
        }

        public bool UpdateDocumentContent(DocumentDTO d, string newContent)
        {
            return _register.UpdateDocumentContent(d, newContent);
        }

        public bool ChangeDocumentName(DocumentDTO doc, string newName)
        {
            bool changedNames = _register.ChangeDocumentName(doc, newName);
            return changedNames;
        }

        public bool DeleteDocument(DocumentDTO d)
        {
            return _register.DeleteDocument(d);
        }

        public string? GetDocumentContent(DocumentDTO d)
        {
            string? content = _register.GetDocumentContent(d);
            return content;
        }

        public bool SaveDocument(DocumentDTO d, string docContent)
        {
            bool stored = _register.UpdateDocumentContent(d, docContent);
            return stored;
        }
    }
}