namespace webserver
{
    public class AppFacade 
    {
        #region Fields
        private DocumentsController _docs;
        private AccountsController _accs;
        private ProjectsController _projects;
        #endregion


        #region Methods
        public AppFacade(DocumentsController docs, AccountsController accs, ProjectsController projects)
        {
            _docs = docs;
            _accs = accs;
            _projects = projects;
        }

        public bool CreateUser(string email, string username, string password)
        {
            return _accs.CreateAccount(email, username, password);
        }

        public string? ValidateLogin(string email, string password)
        {
            return _accs.ValidateLogin(email, password);
        }

        public bool DeleteUser(string userId)
        {
            return _accs.DeleteUser(userId);
        }

        public string? GetAccountInfoJson(string userId)
        {
            return _accs.GetUserInfoJson(userId);
        }

        public bool UpdateUserInfo(string userId, string email, string username, string password)
        {
            return _accs.UpdateUserInfo(userId, email, username, password);
        }

        public string? GetAllUserProjectsJson(string userId)
        {
            Account? acc = _accs.GetAccount(userId);
            if(acc == null)
                return null;

            return _projects.GetUserProjectsJson(acc);
        }

        public string? CreateProject(string userId, string projectName)
        {
            Account? user = _accs.GetAccount(userId);
            if(user == null)
                return null;

            return _projects.CreateProject(user, projectName);
        }

        public string? GetAllProjectDocumentsJson(string projectId)
        {
            return _projects.GetProjectDocumentsJson(projectId);
        }

        public string? CreateDocument(string projectId, string documentName)
        {
            return _projects.CreateDocument(projectId, documentName);
        }

        public bool ChangeProjectName(string projectId, string newName)
        {
            return _projects.ChangeProjectName(projectId, newName);
        }

        public bool DeleteProject(string projectId)
        {
            return _projects.DeleteProject(projectId);
        }

        public string? GetDocumentContent(string documentId)
        {
            return _docs.GetDocumentContent(documentId);
        }

        public bool RenameDocument(string documentId, string newName)
        {
            return _docs.ChangeDocumentName(documentId, newName);
        }

        public bool UpdateDocumentContent(string documentId, string newContent)
        {
            return _docs.SaveDocument(documentId, newContent);
        }

        public bool DeleteDocument(string documentId)
        {
            return _docs.DeleteDocument(documentId);
        }
        #endregion
    }
}