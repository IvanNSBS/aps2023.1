using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace webserver
{
    [Route("accounts")]
    [ApiController]
    public class AccountsRoute : ControllerBase
    {
        private readonly AppFacade _facade;

        public AccountsRoute(AppFacade facade)
        {
            _facade = facade;
        }

        [HttpPost]
        [Route("create_account")]
        public async Task<ActionResult> CreateAccount()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(400, "Invalid request body");
            
            string? email = data.SelectToken("email")?.Value<string>();
            string? username = data.SelectToken("username")?.Value<string>();
            string? password = data.SelectToken("password")?.Value<string>();
            if(email == null || username == null || password == null)
                return StatusCode(404, "Invalid Email, Username or Password");

            bool created = _facade.CreateUser(email, username, password);
            if(created)
                return Ok("User Created!");
            
            return StatusCode(403, "Could not create user. Email already registered");
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(400, "Invalid request body");
            
            string? email = data.SelectToken("email")?.Value<string>();
            string? password = data.SelectToken("password")?.Value<string>();
            if(email == null || password == null)
                return StatusCode(400, "Invalid Email or Password");

            string? userId = _facade.ValidateLogin(email, password);
            if(userId == null)
                return StatusCode(404, "Wrong Email or Password");

            return Ok(userId);
        }

        [HttpDelete]
        [Route("delete_user/{userId}")]
        public ActionResult<bool> DeleteUser(string userId)
        {
            return _facade.DeleteUser(userId);
        }

        [HttpGet]
        [Route("get_user_info/{userId}")]
        public ActionResult<string> GetUserInfo(string userId)
        {
            string? accInfoJson = _facade.GetAccountInfoJson(userId);
            if(accInfoJson == null)
                return StatusCode(404, "There's no username with this id");
            return Ok(accInfoJson);
        }

        [HttpPut]
        [Route("update_user_info")]
        public async Task<ActionResult> UpdateUserInfo()
        {
            using var reader = new StreamReader(HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            
            var data = JsonConvert.DeserializeObject<JObject>(body);
            if(data == null)
                return StatusCode(400, "Invalid request body");
            
            string? userId = data.SelectToken("userId")?.Value<string>();
            string? email = data.SelectToken("email")?.Value<string>();
            string? username = data.SelectToken("username")?.Value<string>();
            string? password = data.SelectToken("password")?.Value<string>();
            if(userId == null || email == null || username == null || password == null)
                return StatusCode(404, "Invalid AccountId, Email, Username or Password");

            bool updated = _facade.UpdateUserInfo(userId, email, username, password);
            if(updated)
                return Ok("User Info Updated!");
            
            return StatusCode(403, "Could update user. User not found");
        }
    }
}