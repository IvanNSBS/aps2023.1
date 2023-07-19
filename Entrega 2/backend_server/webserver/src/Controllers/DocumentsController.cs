using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace webserver
{
    [Route("documents")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentsRepository _repo;

        public DocumentsController(IDocumentsRepository repo)
        {
            _repo = repo;
        }

        [HttpPut]
        [Route("set_document_name")]
        public async Task<ActionResult<bool>> ChangeProjectName()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? documentId = data.SelectToken("document_id")?.Value<string>();
            string? newName = data.SelectToken("new_name")?.Value<string>();
            if(documentId == null || newName == null)
                return StatusCode(404, "Invalid Document Id or new document name");

            bool changedNames = _repo.ChangeDocumentName(documentId, newName);
            return changedNames;
        }

        [HttpDelete]
        [Route("delete_document/{documentId}")]
        public async Task<ActionResult<bool>> DeleteDocument(string documentId)
        {
            return _repo.DeleteDocument(documentId);
        }
    }
}