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

        public bool CreateUser(Account acc)
        {
            return _accs.CreateAccount(acc);
        }

        public string? ValidateLogin(Account acc)
        {
            return _accs.ValidateLogin(acc);
        }

        public bool DeleteUser(Account acc)
        {
            return _accs.DeleteUser(acc);
        }

        public string? GetAccountInfoJson(string userId)
        {
            return _accs.GetUserInfoJson(userId);
        }

        public bool UpdateUserInfo(Account oldUser, Account newUser)
        {
            return _accs.UpdateUserInfo(oldUser, newUser);
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

        public string? GetAllProjectDocumentsJson(Project project)
        {
            return _projects.GetProjectDocumentsJson(project);
        }

        public string? CreateDocument(Project project, string documentName)
        {
            return _projects.CreateDocument(project, documentName);
        }

        public bool ChangeProjectName(Project project, string newName)
        {
            return _projects.ChangeProjectName(project, newName);
        }

        public bool DeleteProject(Project project)
        {
            return _projects.DeleteProject(project);
        }

        public string? GetDocumentContent(Document d)
        {
            return _docs.GetDocumentContent(d);
        }

        public bool RenameDocument(Document d, string newName)
        {
            return _docs.ChangeDocumentName(d, newName);
        }

        public bool UpdateDocumentContent(Document d, string newContent)
        {
            return _docs.SaveDocument(d, newContent);
        }

        public bool DeleteDocument(Document d)
        {
            return _docs.DeleteDocument(d);
        }
        #endregion
    }
}