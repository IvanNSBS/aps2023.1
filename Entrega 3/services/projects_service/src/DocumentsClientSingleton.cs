namespace webserver
{
    public class DocumentsHTTPClient
    {
        private HttpClient _client;
        private static DocumentsHTTPClient _instance;
        public static DocumentsHTTPClient Instance
        {
            get
            {
                if(_instance == null)
                    _instance = new DocumentsHTTPClient();
                
                return _instance;
            }
        }

        private DocumentsHTTPClient()
        {
            _client = new()
            {
                BaseAddress = new Uri("http://documents_service:8200"),
            };
        }

        public async Task<HttpResponseMessage> SendAsyncPost(string endpoint, string json)
        {
            HttpResponseMessage response = await _client.PostAsJsonAsync($"documents/{endpoint}", json);
            response.EnsureSuccessStatusCode();
            return response;
        }

        public async Task<HttpResponseMessage> SendAsyncGet(string endpoint)
        {
            HttpResponseMessage response = await _client.GetAsync($"documents/{endpoint}");
            response.EnsureSuccessStatusCode();
            return response;
        }

        public async Task<HttpResponseMessage> SendAsyncDelete(string endpoint)
        {
            HttpResponseMessage response = await _client.DeleteAsync($"documents/{endpoint}");
            response.EnsureSuccessStatusCode();
            return response;
        }
    }
}