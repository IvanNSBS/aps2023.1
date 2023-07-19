using System;

namespace webserver
{
    public interface IProjectsRepository
    {
        IdNameTuple[] GetAllUserProjects(string userId);
        void CreateProject(string owner_id, string projectName);
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

        public void CreateProject(string ownerId, string projectName)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Account? acc = db.Accounts.FirstOrDefault(x => x.Id == ownerId);
                if(acc == null) {
                    Console.WriteLine($"There's no account with username {ownerId}");
                    return;
                }

                string uuid = Guid.NewGuid().ToString();
                db.Projects.Add(new Project(uuid, projectName, acc));
                db.SaveChanges();
            }
        }
    }
}