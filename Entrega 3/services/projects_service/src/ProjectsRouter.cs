using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace webserver
{
    [Route("projects")]
    [ApiController]
    public class ProjectsRouter : ControllerBase
    {
        private readonly ProjectsController _controller;
        private static HttpClient client = new()
        {
            BaseAddress = new Uri("http://documents_service:8200"),
        };

        public ProjectsRouter(ProjectsController ctrl)
        {
            _controller = ctrl;
        }

        [HttpGet]
        [Route("test_docker")]
        public ActionResult<string> Test()
        {
            Console.WriteLine("Run!");
            return "Running on docker!";
        }

        [HttpPost]
        [Route("get_user_projects")]
        public async Task<ActionResult<string>> GetUserProjects()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            try
            {
                Console.WriteLine(body);
                var data = JsonConvert.DeserializeObject<JObject>(body);
                if(data == null)
                    return StatusCode(500, "Invalid request body");
                
                JObject? session = data.SelectToken("session")?.Value<JObject>();
                if(session == null)
                    return StatusCode(404, "Invalid userId or projectName");

                var sessionDTO = JsonConvert.DeserializeObject<SessionDTO>(session.ToString());
                string? projectsJson = _controller.GetUserProjectsJson(sessionDTO);
                if(projectsJson == null)
                    return StatusCode(404, "User does not exist");

                return Ok(projectsJson);
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
                return StatusCode(500, "Invalid request body");
            }
            
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
            
            JObject? session = data.SelectToken("session")?.Value<JObject>();
            string? projectName = data.SelectToken("project_name")?.Value<string>();

            if(session == null || projectName == null)
                return StatusCode(404, "Invalid userId or projectName");

            var sessionDTO = JsonConvert.DeserializeObject<SessionDTO>(session.ToString());
            Project? project = _controller.CreateProject(sessionDTO, projectName);
            if(project == null)
                return StatusCode(404, "Could not create project for user. user does not exist");

            ProjectDTO p = new ProjectDTO{id=project.Id, name=project.ProjectName, user=project.UserId};
            string projectJson = JsonConvert.SerializeObject(p);
            return projectJson;
        }

        [HttpPut]
        [Route("change_project_name")]
        public async Task<ActionResult<string>> ChangeProjectName()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            JObject? session = data.SelectToken("session")?.Value<JObject>();
            JObject? project = data.SelectToken("project")?.Value<JObject>();
            string? newName = data.SelectToken("new_project_name")?.Value<string>();

            if(session == null || project == null || newName == null)
                return StatusCode(404, "Invalid userId or projectName");

            var sessionDTO = JsonConvert.DeserializeObject<SessionDTO>(session.ToString());
            var projectDTO = JsonConvert.DeserializeObject<ProjectDTO>(project.ToString());
            bool changed = _controller.ChangeProjectName(sessionDTO, projectDTO, newName);

            return Ok(changed);
        }


        [HttpDelete]
        [Route("delete_project/{projectId}")]
        public async Task<ActionResult<bool>> DeleteProject(string projectId)
        {
            ProjectDTO p = new ProjectDTO{id=projectId, name="", user=""};
            return await _controller.DeleteProject(p);
        }

        [HttpPost]
        [Route("create_document")]
        public async Task<ActionResult<string>> CreateDocument()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            using HttpResponseMessage response = await client.PostAsJsonAsync("documents/create_document", body);
            response.EnsureSuccessStatusCode();
            
            var jsonResponse = await response.Content.ReadAsStringAsync();
            return Ok(jsonResponse);
        }

        [HttpGet]
        [Route("get_project_documents/{projectId}")]
        public async Task<ActionResult<string>> GetProjectDocuments(string projectId)
        {
            string uri = $"documents/get_project_documents/{projectId}";
            Console.WriteLine("Get Documents Uri: " + uri);
            using HttpResponseMessage response = await client.GetAsync(uri);
            response.EnsureSuccessStatusCode();
            
            var jsonResponse = await response.Content.ReadAsStringAsync();
            Console.WriteLine(jsonResponse);
            return Ok(jsonResponse);
        }
    }
}