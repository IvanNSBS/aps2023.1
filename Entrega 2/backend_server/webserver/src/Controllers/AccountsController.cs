using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
        }

        [HttpPost]
        [Route("create_account")]
        public async Task<ActionResult> CreateAccount()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? email = data.SelectToken("email")?.Value<string>();
            string? username = data.SelectToken("username")?.Value<string>();
            string? password = data.SelectToken("password")?.Value<string>();
            if(email == null || username == null || password == null)
                return StatusCode(500, "Invalid Email, Username or Password");

            bool created = _repo.CreateUser(email, username, password);
            if(created)
                return Ok("User Created!");
            
            return StatusCode(500, "Could not create user. Email already registered");
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(500, "Invalid request body");
            
            string? email = data.SelectToken("email")?.Value<string>();
            string? password = data.SelectToken("password")?.Value<string>();
            if(email == null || password == null)
                return StatusCode(500, "Invalid Email or Password");

            string? userId = _repo.ValidateUser(email, password);
            if(userId == null)
                return StatusCode(500, "Wrong Email or Password");

            return Ok(userId);
        }
    }
}