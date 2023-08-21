using System;

namespace webserver
{
    public interface IProjectsRepository
    {
        Project? GetProject(string projectId);
        IdNameTuple[] GetAllUserProjects(Account user);
        string AddProject(Project project);
        bool ChangeProjectName(Project project, string newName);
        bool DeleteProject(Project project);
    }

    public class ProjectsRepository : IProjectsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public ProjectsRepository(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public IdNameTuple[] GetAllUserProjects(Account user)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var projects = db.Projects.Where(x => x.Owner.Id == user.Id).Select(x => new IdNameTuple{id=x.Id, name=x.ProjectName});
                return projects.ToArray();
            }
        }

        public Project? GetProject(string projectId)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Project? project = db.Projects.FirstOrDefault(x => x.Id == projectId);
                return project;
            }
        }

        public string AddProject(Project project)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Projects.Add(project);
                db.SaveChanges();

                return project.Id;
            }
        }

        public bool ChangeProjectName(Project project, string newName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                project.ProjectName = newName;
                db.SaveChanges();
                return true;
            }
        }

        public bool DeleteProject(Project project)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Document[] docsToRemove = db.Documents.Where(x => x.ProjectFK == project.Id).ToArray();
                foreach(Document doc in docsToRemove)
                    db.Documents.Remove(doc);

                db.Projects.Remove(project);
                db.SaveChanges();
                return true;
            }
        }
    }
}