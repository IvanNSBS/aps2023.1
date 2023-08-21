using System;

namespace webserver
{
    public interface IDocumentsRepository
    {
        Document[] GetAllProjectDocuments(Project project);
        Document? GetDocument(string documentId);
        void AddDocument(Document doc);
        bool ChangeDocumentName(Document document, string newName);
        bool UpdateDocumentContent(Document document, string documentContent);
        bool DeleteDocument(Document document);
    }

    public class DocumentsRepository : IDocumentsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public DocumentsRepository(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public Document? GetDocument(string documentId)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var doc = db.Documents.Find(documentId);
                return doc;
            }
        }

        public Document[] GetAllProjectDocuments(Project project)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var documents = db.Documents.Where(x => x.Project.Id == project.Id);
                return documents.ToArray();
            }
        }

        public void AddDocument(Document document)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Documents.Add(document);
                db.SaveChanges();
            }
        }

        public bool UpdateDocumentContent(Document document, string documentContent)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var updateDoc = db.Documents.Find(document.Id);
                if(updateDoc != null)
                    updateDoc.Content = documentContent;
                db.SaveChanges();
                return true;
            }
        }

        public bool ChangeDocumentName(Document document, string newName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var updateDoc = db.Documents.Find(document.Id);
                if(updateDoc != null)
                    updateDoc.DocumentName = newName;
                db.SaveChanges();
                return true;
            }
        }

        public bool DeleteDocument(Document document)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Documents.Remove(document);
                db.SaveChanges();
                return true;
            }
        }
    }
}