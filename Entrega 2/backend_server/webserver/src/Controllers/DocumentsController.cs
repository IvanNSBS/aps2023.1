using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace webserver
{
    [Route("projects")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentsRepository _repo;

        public DocumentsController(IDocumentsRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        [Route("get_project_documents/{projectId}")]
        public ActionResult<string> GetProjectDocuments(string projectId)
        {
            return string.Join(",", _repo.GetAllProjectDocuments(projectId));
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

            _repo.CreateDocument(projectId, documentName);
            return Ok();
        }
    }
}