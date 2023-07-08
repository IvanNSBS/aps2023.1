using System;

namespace webserver
{
    public interface IProjectsRepository
    {
        string[] GetAllUserProjects();
        void CreateProject(string name);
    }

    public class ProjectsRepository : IProjectsRepository
    {
        private readonly IServiceScopeFactory _scopeFactory;
        
        public ProjectsRepository(IServiceScopeFactory scopeFactory)
        {
            // _db = configuration;
            this._scopeFactory = scopeFactory;
        }

        public string[] GetAllUserProjects()
        {
            // return new[] { "asdasd" };
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return db.Projects.Select(x => x.ProjectName).ToArray();
            }
        }

        public void CreateProject(string name)
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                string uuid = Guid.NewGuid().ToString();
                db.Projects.Add(new Project(uuid, name));
                db.SaveChanges();
            }
        }
    }
}