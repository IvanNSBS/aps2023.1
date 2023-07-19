import React, { FC, ReactElement } from "react";
import "./Views/LoginView" 
import LoginView from "./Views/LoginView";
import AllProjectsView from "./Views/AllProjectsView";
import DocumentEditorView from "./Views/DocumentEditor/DocumentEditorView";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import CreateUserView from "./Views/CreateUserView";
import ProjectView from "./Views/ProjectView";
import { AppContextProvider } from "./AppContext";
import { LoginController } from "./Controllers/LoginController";
import { ProjectsPresenter } from "./Controllers/ProjectsPresenter";
import { DocumentController } from "./Controllers/DocumentController";

const loginController = new LoginController();
const projectsPresenter = new ProjectsPresenter();
const documentController = new DocumentController();

const App: FC = (): ReactElement => {
  return (
    <>
      <AppContextProvider>
        <Routes>
          <Route path={AppRoutes.login} element={ <LoginView loginController={loginController}/> }></Route>
          <Route path={AppRoutes.register} element={ <CreateUserView loginController={loginController}/> }></Route>
          <Route path={AppRoutes.projects} element={ <AllProjectsView projectsPresenter={projectsPresenter}/> }></Route>
          <Route path={AppRoutes.project_view} element={ <ProjectView projectsPresenter={projectsPresenter}/> }></Route>
          <Route path={AppRoutes.edit_document} element={ <DocumentEditorView documentController={documentController}/> }></Route>
        </Routes>
      </AppContextProvider>
    </>
  );
}

export default App;
