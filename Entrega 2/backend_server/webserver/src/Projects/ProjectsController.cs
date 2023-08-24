using Newtonsoft.Json;

namespace webserver
{
    public class ProjectsController
    {
        private readonly IProjectsRegister _register;

        public ProjectsController(IProjectsRegister register)
        {
            _register = register;
        }

        public string GetUserProjectsJson(Account user)
        {
            var allProjects = _register.GetAllUserProjects(user);
            var allProjectsInfo = allProjects.Select(x => new IdNameTuple{name= x.ProjectName, id = x.Id});
            string jsonString = JsonConvert.SerializeObject(allProjectsInfo);
            return jsonString;
        }

        public string? CreateProject(Account user, string projectName)
        {
            Project? p = _register.AddProject(user, projectName);
            return p?.Id;
        }

        public string? GetProjectDocumentsJson(Project project)
        {
            var allDocuments = _register.GetAllProjectsDocument(project);
            var allDocsInfo = allDocuments.Select(x => new IdNameTuple{name=x.DocumentName, id=x.Id});
            string allDocsJson = JsonConvert.SerializeObject(allDocsInfo);
            return allDocsJson;
        }

        public string? CreateDocument(Project project, string documentName)
        {
            Document? d = _register.AddDocumentToProject(project, documentName);
            return d?.Id;
        }

        public bool ChangeProjectName(Project project, string newName)
        {
            bool changedNames = _register.ChangeProjectName(project, newName);
            return changedNames;
        }

        public bool DeleteProject(Project project)
        {
            _register.DeleteProject(project);
            return true;
        }
    }
}