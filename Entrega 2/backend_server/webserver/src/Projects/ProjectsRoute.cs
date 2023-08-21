using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace webserver
{
    [Route("projects")]
    [ApiController]
    public class ProjectsRoute : ControllerBase
    {
        private readonly AppFacade _facade;

        public ProjectsRoute(AppFacade facade)
        {
            _facade = facade;
        }

        [HttpGet]
        [Route("get_user_projects/{userId}")]
        public ActionResult<string> GetUserProjects(string userId)
        {
            string? projectsJson = _facade.GetAllUserProjectsJson(userId);
            if(projectsJson == null)
                return StatusCode(404, "User does not exist");

            return Ok(projectsJson);
        }

        [HttpPost]
        [Route("create_project")]
        public async Task<ActionResult<string>> CreateProject()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? userId = data.SelectToken("user_id")?.Value<string>();
            string? projectName = data.SelectToken("project_name")?.Value<string>();

            if(userId == null || projectName == null)
                return StatusCode(404, "Invalid userId or projectName");

            string? projectId = _facade.CreateProject(userId, projectName);
            if(projectId == null)
                return StatusCode(404, "Could not create project for user. userId does not exist");

            return projectId;
        }

        [HttpGet]
        [Route("get_project_documents/{projectId}")]
        public ActionResult<string> GetProjectDocuments(string projectId)
        {
            string? allDocumentsJson = _facade.GetAllProjectDocumentsJson(projectId);
            if(allDocumentsJson == null)
                return StatusCode(404, "Project does not exist");

            return Ok(allDocumentsJson);
        }

        [HttpPost]
        [Route("create_document")]
        public async Task<ActionResult<string>> CreateDocument()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? projectId = data.SelectToken("project_id")?.Value<string>();
            string? documentName = data.SelectToken("document_name")?.Value<string>();

            if(projectId == null || documentName == null)
                return StatusCode(404, "Invalid Project Id or Document Name");

            string? documentId = _facade.CreateDocument(projectId, documentName);
            if(documentId == null)
                return StatusCode(404, "Could not create document for project. ProjectId does not exist");

            return documentId;
        }

        [HttpPut]
        [Route("set_project_name")]
        public async Task<ActionResult<bool>> ChangeProjectName()
        {
            Console.WriteLine("awiodasjdas");
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? projectId = data.SelectToken("project_id")?.Value<string>();
            string? newName = data.SelectToken("new_name")?.Value<string>();
            if(projectId == null || newName == null)
                return StatusCode(404, "Invalid Project Id or new project name");

            bool changedNames = _facade.ChangeProjectName(projectId, newName);
            return changedNames;
        }

        [HttpDelete]
        [Route("delete_project/{projectId}")]
        public ActionResult<bool> DeleteProject(string projectId)
        {
            return _facade.DeleteProject(projectId);
        }
    }
}