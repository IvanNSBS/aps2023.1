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
    }
}