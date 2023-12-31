import React, { FC, ReactElement } from "react";
import "./Views/LoginView" 
import LoginView from "./Views/LoginView";
import HomeView from "./Views/HomeView";
import DocumentEditorView from "./Views/DocumentEditor/DocumentEditorView";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import CreateUserView from "./Views/CreateUserView";
import ProjectView from "./Views/ProjectView";
import { AppContextProvider } from "./AppContext";
import { LoginPresenter } from "./Controllers/LoginController";
import { ProjectsPresenter } from "./Controllers/ProjectsPresenter";
import { DocumentController } from "./Controllers/DocumentController";
import { UserController } from "./Controllers/UserController";
import UserSettingsView from "./Views/UserSettingsView";
import { BingSpellCheckProvider } from "./Controllers/BingSpellCheckProvider";
import { ISpellCheckProvider } from "./Controllers/ISpellCheckProvider";

const loginPresenter = new LoginPresenter();
const projectsPresenter = new ProjectsPresenter();
const spellCheckProvider: ISpellCheckProvider = new BingSpellCheckProvider();
const documentController = new DocumentController(spellCheckProvider);
const userController = new UserController();

const App: FC = (): ReactElement => {
  return (
    <>
      <AppContextProvider>
        <Routes>
          <Route path={AppRoutes.login} element={ <LoginView loginController={loginPresenter}/> }></Route>
          <Route path={AppRoutes.register} element={ <CreateUserView loginController={loginPresenter}/> }></Route>
          <Route path={AppRoutes.projects} element={ <HomeView projectsPresenter={projectsPresenter}/> }></Route>
          <Route path={AppRoutes.project_view} element={ <ProjectView projectsPresenter={projectsPresenter}/> }></Route>
          <Route path={AppRoutes.edit_document} element={ <DocumentEditorView documentController={documentController}/> }></Route>
          <Route path={AppRoutes.user_settings} element={ <UserSettingsView userController={userController}/> }></Route>
        </Routes>
      </AppContextProvider>
    </>
  );
}

export default App;
