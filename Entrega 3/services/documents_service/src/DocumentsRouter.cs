using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace webserver
{
    [Route("documents")]
    [ApiController]
    public class DocumentsRouter : ControllerBase
    {
        private readonly DocumentsController _controller;

        public DocumentsRouter(DocumentsController ctrl)
        {
            _controller = ctrl;
        }

        [HttpPost]
        [Route("create_document")]
        public async Task<ActionResult<bool>> CreateProject()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            body = JsonConvert.DeserializeObject<string>(body);
            var data = JsonConvert.DeserializeObject<CreateDocumentDTO>(body);
            
            ProjectDTO p = new ProjectDTO{id=data.project.id, name=data.project.name, user=""};
            Document? d = _controller.CreateDocument(p, data.doc_name);
            if(d == null)
                return StatusCode(500, "Something went wrong");

            DocumentDTO doc = new DocumentDTO{id=d.Id, name=d.DocumentName, content="", projectId=d.ProjectId};
            return Ok(JsonConvert.SerializeObject(doc));
        }

        [HttpGet]
        [Route("test_docker")]
        public ActionResult<string> Test()
        {
            Console.WriteLine("Run!");
            return "Running on docker!";
        }

        [HttpGet]
        [Route("get_project_documents/{project_id}")]
        public ActionResult<string> GetProjectDocuments(string project_id)
        {
            ProjectDTO p = new ProjectDTO{id=project_id, name="", user=""};
            Console.WriteLine($"Project Id: {project_id}");
            Document[] docs = _controller.GetProjectDocuments(p);
            
            DocumentDTO[] serializeDocs = docs.Select(x => new DocumentDTO{id=x.Id, name=x.DocumentName, content="", projectId=x.ProjectId}).ToArray();
            Console.WriteLine(JsonConvert.SerializeObject(serializeDocs));
            return Ok(JsonConvert.SerializeObject(serializeDocs));
        }

        [HttpGet]
        [Route("get_doc_content/{documentId}")]
        public ActionResult<string> GetDocumentContent(string documentId)
        {
            DocumentDTO d = new DocumentDTO{id=documentId, name="", content="", projectId=""};
            string? content = _controller.GetDocumentContent(d);
            if(content == null)
                return StatusCode(404, "There's no document with the given id or document wasn't initialized");
            return Ok(content);
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
            
            JObject? document = data.SelectToken("document")?.Value<JObject>();
            string? newName = data.SelectToken("new_name")?.Value<string>();
            if(document == null || newName == null)
                return StatusCode(404, "Invalid Document Id or new document name");

            DocumentDTO d = JsonConvert.DeserializeObject<DocumentDTO>(document.ToString());
            bool changedNames = _controller.ChangeDocumentName(d, newName);
            return changedNames;
        }

        [HttpDelete]
        [Route("delete_document/{documentId}")]
        public ActionResult<bool> DeleteDocument(string documentId)
        {
            DocumentDTO d = new DocumentDTO{id=documentId, name="", content="", projectId=""};
            return _controller.DeleteDocument(d);
        }

        [HttpDelete]
        [Route("delete_project_documents/{projectId}")]
        public ActionResult<bool> DeleteProjectDocuments(string projectId)
        {
            ProjectDTO p = new ProjectDTO{id=projectId, name="", user=""};
            _controller.DeleteProjectDocuments(p);
            return Ok(true);
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
            
            JObject? document = data.SelectToken("document")?.Value<JObject>();
            string? docContent = data.SelectToken("doc_content")?.Value<string>();
            if(document == null || docContent == null)
                return StatusCode(404, "Invalid Document Id or new document name");

            DocumentDTO d = JsonConvert.DeserializeObject<DocumentDTO>(document.ToString());
            bool stored = _controller.UpdateDocumentContent(d, docContent);
            if(stored)
                return Ok();
                
            return StatusCode(500);
        }
    }
}