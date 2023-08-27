namespace webserver
{
    public interface IDocumentsRegister
    {
        Document CreateDocument(ProjectDTO project, string docName);
        Document[] GetProjectDocuments(ProjectDTO project);
        bool ChangeDocumentName(DocumentDTO d, string newName);
        bool DeleteDocument(DocumentDTO d);
        string? GetDocumentContent(DocumentDTO d);
        bool UpdateDocumentContent(DocumentDTO d, string newContent);
    }

    public class DocumentsRegister : IDocumentsRegister
    {
        private readonly IDocumentsRepository _repo;
        
        public DocumentsRegister(IDocumentsRepository repo)
        {
            _repo = repo;
        }

        public Document CreateDocument(ProjectDTO project, string docName)
        {
            string uuid = Guid.NewGuid().ToString();
            Document d = new Document(uuid, docName, "", project.id);
            _repo.AddDocument(d);
            return d;
        }

        public Document[] GetProjectDocuments(ProjectDTO project)
        {
            return _repo.GetAllProjectDocuments(project);
        }


        public bool ChangeDocumentName(DocumentDTO d, string newName)
        {
            return _repo.ChangeDocumentName(d, newName);
        }

        public bool DeleteDocument(DocumentDTO d)
        {
            Document? document = _repo.GetDocument(d);
            if(document != null)
                return _repo.DeleteDocument(document);

            return false;
        }

        public string? GetDocumentContent(DocumentDTO d)
        {
            return _repo.GetDocument(d)?.Content;
        }

        public bool UpdateDocumentContent(DocumentDTO d, string newContent)
        {
            return _repo.UpdateDocumentContent(d, newContent);
        }
    }
}