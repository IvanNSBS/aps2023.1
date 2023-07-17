import React, { FC, ReactElement } from "react";
import "./Views/LoginView" 
import LoginView from "./Views/LoginView";
import AllProjectsView from "./Views/AllProjectsView";
import DocumentEditorView from "./Views/DocumentEditor/DocumentEditorView";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import CreateUserView from "./Views/CreateUserView";
import ProjectView from "./Views/ProjectView";

const App: FC = (): ReactElement => {
  return (
    <>
      <Routes>
        <Route path={AppRoutes.login} element={ <LoginView/> }></Route>
        <Route path={AppRoutes.register} element={ <CreateUserView/> }></Route>
        <Route path={AppRoutes.projects} element={ <AllProjectsView/> }></Route>
        <Route path={AppRoutes.project_view} element={ <ProjectView/> }></Route>
        <Route path={AppRoutes.edit_document} element={ <DocumentEditorView/> }></Route>
      </Routes>
    </>
  );
}

export default App;
