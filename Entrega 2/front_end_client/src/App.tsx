import React, { FC, ReactElement } from "react";
import "./Views/LoginView" 
import LoginView from "./Views/LoginView";
import ProjectsView from "./Views/ProjectsView";
import DocumentEditorView from "./Views/DocumentEditorView";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import CreateUserView from "./Views/CreateUserView";

const App: FC = (): ReactElement => {
  return (
    <>
      <Routes>
        <Route path={AppRoutes.login} element={ <LoginView/> }></Route>
        <Route path={AppRoutes.register} element={ <CreateUserView/> }></Route>
        <Route path={AppRoutes.projects} element={ <ProjectsView/> }></Route>
        <Route path={AppRoutes.edit_document} element={ <DocumentEditorView/> }></Route>
      </Routes>
    </>
  );
}

export default App;
