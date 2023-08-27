using Newtonsoft.Json;

namespace webserver
{
    public class ProjectsController
    {
        private readonly IProjectsRegistor _register;
        private static HttpClient client = new()
        {
            BaseAddress = new Uri("http://documents_service:8200"),
        };

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

        public async Task<bool> DeleteProject(ProjectDTO project)
        {
            bool deleted = _register.DeleteProject(project);
            using HttpResponseMessage response = await DocumentsHTTPClient.Instance.SendAsyncDelete($"delete_project_documents/{project.id}");
            response.EnsureSuccessStatusCode();
            return deleted;
        }
    }
}