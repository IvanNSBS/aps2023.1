using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
        }

        [HttpGet]
        [Route("get_user_projects/{userId}")]
        public ActionResult<string> GetUserProjects(string userId)
        {
            return string.Join(",", _repo.GetAllUserProjects(userId));
        }

        [HttpPost]
        [Route("create_project")]
        public async Task<ActionResult> CreateProject()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? userId = data.SelectToken("user_id")?.Value<string>();
            string? projectName = data.SelectToken("project_name")?.Value<string>();

            if(userId == null || projectName == null)
                return StatusCode(500, "Invalid Email, Username or Password");

            _repo.CreateProject(userId, projectName);
            return Ok();
        }
    }
}