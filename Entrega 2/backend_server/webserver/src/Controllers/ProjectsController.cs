using Microsoft.AspNetCore.Mvc;

namespace webserver
{
    [Route("projects")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectsRepository _repo;

        public ProjectsController(IProjectsRepository repo)
        {
            _repo = repo;
            Console.Write("created!!!");
        }

        [HttpGet]
        [Route("test_get")]
        public ActionResult<string> TestGet()
        {
            return string.Join(",", _repo.GetAllUserProjects());
        }

        [HttpPost]
        [Route("test_post/{project_name}")]
        public ActionResult TestPost(string project_name)
        {
            _repo.CreateProject(project_name);
            return Ok();
        }
    }
}