using System;

namespace webserver
{
    public interface IProjectsRepository
    {
        Project? GetProject(ProjectDTO project);
        Project[] GetAllUserProjects(UserDTO user);
        string AddProject(Project project);
        bool ChangeProjectName(ProjectDTO project, string newName);
        bool DeleteProject(Project project);
    }

    public class ProjectsRepository : IProjectsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public ProjectsRepository(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public Project[] GetAllUserProjects(UserDTO user)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var projects = db.Projects.Where(x => x.UserId == user.id);
                return projects.ToArray();
            }
        }

        public Project? GetProject(ProjectDTO project)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Project? p = db.Projects.FirstOrDefault(x => x.Id == project.id);
                return p;
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

        public bool ChangeProjectName(ProjectDTO project, string newName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Project? p = db.Projects.Find(project.id);
                if(p != null)
                {
                    p.ProjectName = newName;
                    db.SaveChanges();
                    return true;
                }
                
                return false;
            }
        }

        public bool DeleteProject(Project project)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                // Document[] docsToRemove = db.Documents.Where(x => x.ProjectFK == project.Id).ToArray();
                // foreach(Document doc in docsToRemove)
                //     db.Documents.Remove(doc);

                db.Projects.Remove(project);
                db.SaveChanges();
                return true;
            }
        }
    }
}