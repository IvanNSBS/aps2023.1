using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace webserver
{
    [Route("projects")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectsRepository _projectsRepo;
        private readonly IDocumentsRepository _docsRepo;

        public ProjectsController(IProjectsRepository projectsRepo, IDocumentsRepository docsRepo)
        {
            _projectsRepo = projectsRepo;
            _docsRepo = docsRepo;
        }

        [HttpGet]
        [Route("get_user_projects/{userId}")]
        public ActionResult<string> GetUserProjects(string userId)
        {
            var allProjects = _projectsRepo.GetAllUserProjects(userId);
            string jsonString = JsonConvert.SerializeObject(allProjects);
            return jsonString;
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

            _projectsRepo.CreateProject(userId, projectName);
            return Ok();
        }

        [HttpGet]
        [Route("get_project_documents/{projectId}")]
        public ActionResult<string> GetProjectDocuments(string projectId)
        {
            return string.Join(",", _docsRepo.GetAllProjectDocuments(projectId));
        }

        [HttpPost]
        [Route("create_document")]
        public async Task<ActionResult> CreateDocument()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? projectId = data.SelectToken("project_id")?.Value<string>();
            string? documentName = data.SelectToken("document_name")?.Value<string>();

            if(projectId == null || documentName == null)
                return StatusCode(500, "Invalid Project Id or Document Name");

            _docsRepo.CreateDocument(projectId, documentName);
            return Ok();
        }
    }
}