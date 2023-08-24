using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace webserver
{
    [Route("accounts")]
    [ApiController]
    public class AccountsControllerMVC : ControllerBase
    {
        private readonly AppFacade _facade;

        public AccountsControllerMVC(AppFacade facade)
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

            Account acc = new Account("", email, username, password);
            bool created = _facade.CreateUser(acc);
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

            Account acc = new Account("", email, "", password);
            string? userId = _facade.ValidateLogin(acc);
            if(userId == null)
                return StatusCode(404, "Wrong Email or Password");

            return Ok(userId);
        }

        [HttpDelete]
        [Route("delete_user/{userId}")]
        public ActionResult<bool> DeleteUser(string userId)
        {
            Account acc = new Account(userId, "", "", "");
            return _facade.DeleteUser(acc);
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

            Account oldUser = new Account(userId, "", "", "");
            Account newUser = new Account(userId, email, username, password);
            bool updated = _facade.UpdateUserInfo(oldUser, newUser);
            if(updated)
                return Ok("User Info Updated!");
            
            return StatusCode(403, "Could update user. User not found");
        }
    }
}