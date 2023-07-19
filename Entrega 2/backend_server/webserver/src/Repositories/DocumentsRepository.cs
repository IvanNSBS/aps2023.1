using System;

namespace webserver
{
    public interface IDocumentsRepository
    {
        IdNameTuple[] GetAllProjectDocuments(string projectId);
        string CreateDocument(string projectId, string documentName);
        bool ChangeDocumentName(string documentId, string newName);
    }

    public class DocumentsRepository : IDocumentsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public DocumentsRepository(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public IdNameTuple[] GetAllProjectDocuments(string projectId)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var documents = db.Documents.Where(x => x.Project.Id == projectId).
                    Select(x => new IdNameTuple{id=x.Id, name=x.DocumentName});
                return documents.ToArray();
            }
        }

        public string CreateDocument(string projectId, string documentName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Project? proj = db.Projects.FirstOrDefault(x => x.Id == projectId);
                if(proj == null) {
                    Console.WriteLine($"There's no account with username {projectId}");
                    return null;
                }

                string uuid = Guid.NewGuid().ToString();
                db.Documents.Add(new Document(uuid, documentName, "", new List<string>(), proj));
                db.SaveChanges();

                return uuid;
            }
        }

        public bool ChangeDocumentName(string documentId, string newName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Document? document = db.Documents.FirstOrDefault(x => x.Id == documentId);
                if(document == null) {
                    Console.WriteLine($"There's no document with id {documentId}");
                    return false;
                }

                string uuid = Guid.NewGuid().ToString();
                document.DocumentName = newName;
                db.SaveChanges();

                return true;
            }
        }
    }
}