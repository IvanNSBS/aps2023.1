namespace webserver
{
    public interface IProjectsRegister
    {
        Project? AddProject(Account user, string projectName);
        Document[] GetAllProjectsDocument(Project p);
        Document? AddDocumentToProject(Project p, string docName);
        Project[] GetAllUserProjects(Account user);
        bool ChangeProjectName(Project p, string newName);
        bool DeleteProject(Project p);
    }

    public class ProjectsRegister : IProjectsRegister
    {
        private readonly IProjectsRepository _projectsRepo;
        private readonly IDocumentsRepository _docsRepo;

        public ProjectsRegister(IProjectsRepository projectsRepo, IDocumentsRepository docsRepo)
        {
            _projectsRepo = projectsRepo;
            _docsRepo = docsRepo;
        }

        public Project? AddProject(Account user, string projectName)
        {
            var userProjects = _projectsRepo.GetAllUserProjects(user);
            bool nameIsUsed = userProjects.Any(x => x.name == projectName);
            if(nameIsUsed)
                return null;

            string uuid = Guid.NewGuid().ToString();
            Project p = new Project(uuid, projectName, user.Id);
            _projectsRepo.AddProject(p);

            return p;
        }

        public Document[] GetAllProjectsDocument(Project p)
        {
            return _docsRepo.GetAllProjectDocuments(p);
        }

        public Document? AddDocumentToProject(Project p, string docName)
        {
            var projectDocs = _docsRepo.GetAllProjectDocuments(p);
            bool nameIsUsed = projectDocs.Any(x => x.DocumentName == docName);
            if(nameIsUsed)
                return null;

            string uuid = Guid.NewGuid().ToString();
            Document d = new Document(uuid, docName, "", null, p.Id);
            _docsRepo.AddDocument(d);

            return d;
        }

        public Project[] GetAllUserProjects(Account user)
        {
            var userProjects = _projectsRepo.GetAllUserProjectsRaw(user);
            return userProjects;
        }

        public bool ChangeProjectName(Project p, string newName)
        {
            return _projectsRepo.ChangeProjectName(p, newName);
        }

        public bool DeleteProject(Project p)
        {
            return _projectsRepo.DeleteProject(p);
        }
    }
}