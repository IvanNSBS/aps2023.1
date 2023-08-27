namespace webserver
{
    public interface IProjectsRegistor
    {
        Project? AddProject(UserDTO user, string projectName);
        // Document[] GetAllProjectsDocument(Project p);
        // Document? AddDocumentToProject(Project p, string docName);
        Project? GetProject(ProjectDTO project);
        Project[] GetAllUserProjects(UserDTO user);
        bool ChangeProjectName(ProjectDTO p, string newName);
        bool DeleteProject(ProjectDTO p);
    }

    public class ProjectsRegistor : IProjectsRegistor
    {
        private readonly IProjectsRepository _projectsRepo;

        public ProjectsRegistor(IProjectsRepository projectsRepo)
        {
            _projectsRepo = projectsRepo;
        }

        public Project? AddProject(UserDTO user, string projectName)
        {
            var userProjects = _projectsRepo.GetAllUserProjects(user);
            bool nameIsUsed = userProjects.Any(x => x.ProjectName == projectName);
            if(nameIsUsed)
                return null;

            string uuid = Guid.NewGuid().ToString();
            Project p = new Project(uuid, projectName, user.id);
            _projectsRepo.AddProject(p);

            return p;
        }

        // public Document[] GetAllProjectsDocument(SessionDTO session, Project p)
        // {
        //     return _docsRepo.GetAllProjectDocuments(p);
        // }

        // public Document? AddDocumentToProject(SessionDTO session, Project p, string docName)
        // {
        //     var projectDocs = _docsRepo.GetAllProjectDocuments(p);
        //     bool nameIsUsed = projectDocs.Any(x => x.DocumentName == docName);
        //     if(nameIsUsed)
        //         return null;

        //     string uuid = Guid.NewGuid().ToString();
        //     Document d = new Document(uuid, docName, "", null, p.Id);
        //     _docsRepo.AddDocument(d);

        //     return d;
        // }
        public Project? GetProject(ProjectDTO project)
        {
            return _projectsRepo.GetProject(project);
        }

        public Project[] GetAllUserProjects(UserDTO user)
        {
            var userProjects = _projectsRepo.GetAllUserProjects(user);
            return userProjects;
        }

        public bool ChangeProjectName(ProjectDTO project, string newName)
        {
            return _projectsRepo.ChangeProjectName(project, newName);
        }

        public bool DeleteProject(ProjectDTO project)
        {
            Project? p = _projectsRepo.GetProject(project);
            if(p != null)
                return _projectsRepo.DeleteProject(p);
            
            return false;
        }
    }
}