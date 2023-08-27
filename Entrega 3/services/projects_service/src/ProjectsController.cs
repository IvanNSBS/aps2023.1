using Newtonsoft.Json;

namespace webserver
{
    public class ProjectsController
    {
        private readonly IProjectsRegistor _register;

        public ProjectsController(IProjectsRegistor register)
        {
            _register = register;
        }

        public string GetUserProjectsJson(SessionDTO session)
        {
            var allProjects = _register.GetAllUserProjects(session.user);
            var allProjectsInfo = allProjects.Select(x => new ProjectDTO{name=x.ProjectName, id=x.Id, user=session.user.id});
            string jsonString = JsonConvert.SerializeObject(allProjectsInfo);
            return jsonString;
        }

        public Project? CreateProject(SessionDTO session, string projectName)
        {
            Project? p = _register.AddProject(session.user, projectName);
            return p;
        }

        public bool ChangeProjectName(SessionDTO session, ProjectDTO project, string newName)
        {
            bool changed = _register.ChangeProjectName(project, newName);
            return changed;
        }

        public bool DeleteProject(SessionDTO session, ProjectDTO project)
        {
            return _register.DeleteProject(project);
        }

        // public string? GetProjectDocumentsJson(SessionDTO session, ProjectDTO project)
        // {
        //     var allDocuments = _register.GetAllProjectsDocument(project);
        //     var allDocsInfo = allDocuments.Select(x => new IdNameTuple{name=x.DocumentName, id=x.Id});
        //     string allDocsJson = JsonConvert.SerializeObject(allDocsInfo);
        //     return allDocsJson;
        // }

        // public string? CreateDocument(SessionDTO session, ProjectDTO project, string documentName)
        // {
        //     Document? d = _register.AddDocumentToProject(project, documentName);
        //     return d?.Id;
        // }
    }
}