using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace webserver
{
    [Route("accounts")]
    [ApiController]
    public class AccessRouter : ControllerBase
    {
        private readonly AccessController _ctrl;

        public AccessRouter(AccessController ctrl)
        {
            _ctrl = ctrl;
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
            string? password = data.SelectToken("password")?.Value<string>();
            if(email == null || password == null)
                return StatusCode(404, "Invalid Email, Username or Password");

            UserDTO acc = new UserDTO{id="", email=email, password=password};
            User? created = _ctrl.CreateAccount(acc);
            if(created != null)
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

            UserDTO acc = new UserDTO{id="", email=email, password=password};
            Session? session = _ctrl.Login(acc);
            if(session == null)
                return StatusCode(404, "Wrong Email or Password");

            acc.id = session.UserFK;
            SessionDTO sessionDTO = new SessionDTO{id=session.Id, user=acc};
            string sessionJson = JsonConvert.SerializeObject(sessionDTO);
            Console.WriteLine(sessionJson);
            return Ok(sessionJson);
        }

        [HttpPost]
        [Route("validate_session")]
        public async Task<ActionResult> ValidateSession()
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

            UserDTO acc = new UserDTO{id="", email=email, password=password};
            Session? session = _ctrl.Login(acc);
            if(session == null)
                return StatusCode(404, "Wrong Email or Password");

            acc.id = session.UserFK;
            SessionDTO sessionDTO = new SessionDTO{id=session.Id, user=acc};
            string sessionJson = JsonConvert.SerializeObject(sessionDTO);
            return Ok(sessionJson);
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
            string? password = data.SelectToken("password")?.Value<string>();
            if(userId == null || email == null || password == null)
                return StatusCode(404, "Invalid AccountId, Email, Username or Password");

            UserDTO user = new UserDTO{id=userId, email="", password=""};
            UserDTO newData = new UserDTO{id="", email=email, password=password};
            bool updated = _ctrl.UpdateUserInfo(user, newData);
            if(updated)
                return Ok("User Info Updated!");
            
            return StatusCode(403, "Could update user. User not found");
        }
    }
}