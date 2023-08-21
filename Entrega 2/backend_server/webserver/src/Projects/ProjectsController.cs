using Newtonsoft.Json;

namespace webserver
{
    public class ProjectsController
    {
        private readonly IProjectsRepository _projectsRepo;
        private readonly IDocumentsRepository _docsRepo;

        public ProjectsController(IProjectsRepository projectsRepo, IDocumentsRepository docsRepo)
        {
            _projectsRepo = projectsRepo;
            _docsRepo = docsRepo;
        }

        public string GetUserProjectsJson(Account user)
        {
            var allProjects = _projectsRepo.GetAllUserProjects(user);
            string jsonString = JsonConvert.SerializeObject(allProjects);
            return jsonString;
        }

        public string CreateProject(Account user, string projectName)
        {
            string uuid = Guid.NewGuid().ToString();
            Project project = new Project(uuid, projectName, user.Id);

            _projectsRepo.AddProject(project);
            return uuid;
        }

        public string? GetProjectDocumentsJson(string projectId)
        {
            Project? project = _projectsRepo.GetProject(projectId);
            if(project == null)
                return null;

            var allDocuments = _docsRepo.GetAllProjectDocuments(project);
            var allDocsInfo = allDocuments.Select(x => new IdNameTuple{name=x.DocumentName, id=x.Id});
            string allDocsJson = JsonConvert.SerializeObject(allDocsInfo);
            return allDocsJson;
        }

        public string? CreateDocument(string projectId, string documentName)
        {
            Project? project = _projectsRepo.GetProject(projectId);
            if(project == null)
                return null;

            string uuid = Guid.NewGuid().ToString();
            Document doc = new Document(uuid, documentName, "",  null, project.Id);
            _docsRepo.AddDocument(doc);
            return uuid;
        }

        public bool ChangeProjectName(string projectId, string newName)
        {
            Project? project = _projectsRepo.GetProject(projectId);
            if(project == null)
                return false;

            bool changedNames = _projectsRepo.ChangeProjectName(project, newName);
            return changedNames;
        }

        public bool DeleteProject(string projectId)
        {
            Project? project = _projectsRepo.GetProject(projectId);
            if(project == null)
                return false;

            _projectsRepo.DeleteProject(project);
            return true;
        }
    }
}