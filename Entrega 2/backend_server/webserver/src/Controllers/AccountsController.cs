using Microsoft.AspNetCore.Mvc;

namespace webserver
{
    [Route("accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountsRepository _repo;

        public AccountsController(IAccountsRepository repo)
        {
            _repo = repo;
            Console.Write("created!!!");
        }

        [HttpGet]
        [Route("test_get")]
        public ActionResult<string> TestGet()
        {
            return string.Join(",", _repo.GetAllUsernames());
        }

        [HttpPost]
        [Route("test_post/{username}/{password}")]
        public ActionResult TestPost(string username, string password)
        {
            _repo.AddUser(username, password);
            return Ok();
        }
    }
}