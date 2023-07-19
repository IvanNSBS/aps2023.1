using System;

namespace webserver
{
    public interface IProjectsRepository
    {
        IdNameTuple[] GetAllUserProjects(string userId);
        string CreateProject(string owner_id, string projectName);
        bool ChangeProjectName(string projectId, string newName);
    }

    public class ProjectsRepository : IProjectsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public ProjectsRepository(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public IdNameTuple[] GetAllUserProjects(string userId)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var projects = db.Projects.Where(x => x.Owner.Id == userId).Select(x => new IdNameTuple{id=x.Id, name=x.ProjectName});
                return projects.ToArray();
            }
        }

        public string CreateProject(string ownerId, string projectName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? acc = db.Accounts.FirstOrDefault(x => x.Id == ownerId);
                if(acc == null) {
                    Console.WriteLine($"There's no account with username {ownerId}");
                    return null;
                }

                string uuid = Guid.NewGuid().ToString();
                db.Projects.Add(new Project(uuid, projectName, acc));
                db.SaveChanges();

                return uuid;
            }
        }

        public bool ChangeProjectName(string projectId, string newName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Project? project = db.Projects.FirstOrDefault(x => x.Id == projectId);
                if(project == null) {
                    Console.WriteLine($"There's no project with id {projectId}");
                    return false;
                }

                string uuid = Guid.NewGuid().ToString();
                project.ProjectName = newName;
                db.SaveChanges();

                return true;
            }
        }
    }
}