using System;

namespace webserver
{
    public interface IDocumentsRepository
    {
        Document[] GetAllProjectDocuments(ProjectDTO project);
        Document? GetDocument(DocumentDTO document);
        void AddDocument(Document doc);
        bool DeleteDocument(Document document);
        bool ChangeDocumentName(DocumentDTO document, string newName);
        bool UpdateDocumentContent(DocumentDTO document, string documentContent);
    }

    public class DocumentsRepository : IDocumentsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public DocumentsRepository(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public Document? GetDocument(DocumentDTO document)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var doc = db.Documents.Find(document.id);
                return doc;
            }
        }

        public Document[] GetAllProjectDocuments(ProjectDTO project)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var documents = db.Documents.Where(x => x.ProjectId == project.id);
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

        public bool UpdateDocumentContent(DocumentDTO document, string documentContent)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var updateDoc = db.Documents.Find(document.id);
                if(updateDoc != null)
                    updateDoc.Content = documentContent;
                db.SaveChanges();
                return true;
            }
        }

        public bool ChangeDocumentName(DocumentDTO document, string newName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var updateDoc = db.Documents.Find(document.id);
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