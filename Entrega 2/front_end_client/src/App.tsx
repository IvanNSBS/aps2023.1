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
import { ProjectsController } from "./Controllers/ProjectsController";

const loginController = new LoginController();
const projectsController = new ProjectsController();

const App: FC = (): ReactElement => {
  return (
    <>
      <AppContextProvider>
        <Routes>
          <Route path={AppRoutes.login} element={ <LoginView loginController={loginController}/> }></Route>
          <Route path={AppRoutes.register} element={ <CreateUserView/> }></Route>
          <Route path={AppRoutes.projects} element={ <AllProjectsView/> }></Route>
          <Route path={AppRoutes.project_view} element={ <ProjectView/> }></Route>
          <Route path={AppRoutes.edit_document} element={ <DocumentEditorView/> }></Route>
        </Routes>
      </AppContextProvider>
    </>
  );
}

export default App;
