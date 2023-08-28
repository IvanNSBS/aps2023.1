using Newtonsoft.Json;

namespace webserver
{
    public class AccessHTTPClient
    {
        private HttpClient _client;
        private static AccessHTTPClient _instance;
        public static AccessHTTPClient Instance
        {
            get
            {
                if(_instance == null)
                    _instance = new AccessHTTPClient();
                
                return _instance;
            }
        }

        private AccessHTTPClient()
        {
            _client = new()
            {
                BaseAddress = new Uri("http://access_service:8000"),
            };
        }

        public async Task<bool> ValidateSession(SessionDTO sessionDTO)
        {
            string json = JsonConvert.SerializeObject(sessionDTO);
            HttpResponseMessage response = await _client.PostAsJsonAsync($"accounts/validate_ongoing_session", json);
            try
            {
                response.EnsureSuccessStatusCode();
                return true;
            }
            catch(Exception e)
            {
                return false;
            }
        }
    }
}