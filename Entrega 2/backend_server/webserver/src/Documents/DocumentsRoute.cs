using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace webserver
{
    [Route("documents")]
    [ApiController]
    public class DocumentsRoute : ControllerBase
    {
        private readonly AppFacade _facade;

        public DocumentsRoute(AppFacade facade)
        {
            _facade = facade;
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

            bool changedNames = _facade.RenameDocument(documentId, newName);
            return changedNames;
        }

        [HttpDelete]
        [Route("delete_document/{documentId}")]
        public ActionResult<bool> DeleteDocument(string documentId)
        {
            return _facade.DeleteDocument(documentId);
        }

        [HttpGet]
        [Route("get_doc_content/{documentId}")]
        public ActionResult<string> GetDocumentContent(string documentId)
        {
            string? content = _facade.GetDocumentContent(documentId);
            if(content == null)
                return StatusCode(404, "There's no document with the given id or document wasn't initialized");
            return Ok(content);
        }

        [HttpPut]
        [Route("save_doc_content")]
        public async Task<ActionResult> SaveDocument()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? documentId = data.SelectToken("document_id")?.Value<string>();
            string? docContent = data.SelectToken("doc_content")?.Value<string>();
            if(documentId == null || docContent == null)
                return StatusCode(404, "Invalid Document Id or new document content");

            bool stored = _facade.UpdateDocumentContent(documentId, docContent);
            if(stored)
                return Ok();
            return StatusCode(500);
        }
    }
}