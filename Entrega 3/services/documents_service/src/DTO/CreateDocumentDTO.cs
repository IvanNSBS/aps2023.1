namespace webserver
{
    public struct CreateDocProjectInfo {
        public string id;
        public string name;
    }

    public struct CreateDocumentDTO {
        public CreateDocProjectInfo project;
        public string doc_name;
    }
}