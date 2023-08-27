import React, { FC, ReactElement, ReactNode, useRef, useState } from "react";
import { CommandsHistory } from "./Business/Commands/CommandsHistory"
import { ItemInfo } from "./Controllers/ProjectsPresenter";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { CurrentSession } from "./Data/CurrentSession";

type AppCtx = {
    getSession(): CurrentSession | undefined;
    setSession(newSession: CurrentSession | undefined): void;
    getCurrentProjectInfo():ItemInfo | undefined;
    setCurrentProjectInfo(newInfo: ItemInfo | undefined): void;

    getCurrentDocumentInfo():ItemInfo | undefined;
    setCurrentDocumentInfo(newInfo: ItemInfo | undefined): void;

    logout():void;
}

type AppCtxProviderProps = {
    children: ReactNode;
}

export const AppContext = React.createContext<AppCtx | null>(null);

export const AppContextProvider: FC<AppCtxProviderProps> = (props:AppCtxProviderProps): ReactElement => {
    const [session, setCurrentSession] = useState<CurrentSession>();
    const [projectInfo, setProjectInfo] = useState<ItemInfo|undefined>(undefined);
    const [documentInfo, setDocumentInfo] = useState<ItemInfo|undefined>(undefined);
    const navigate = useNavigate();

    const logout = function(){
        setCurrentSession(undefined);
        setProjectInfo(undefined);
        setDocumentInfo(undefined);
        navigate(AppRoutes.login);
    }

    const contextData: AppCtx = {
        getSession: () => session,
        setSession: setCurrentSession,
        getCurrentProjectInfo: () => projectInfo,
        setCurrentProjectInfo: setProjectInfo,
        getCurrentDocumentInfo: () => documentInfo,
        setCurrentDocumentInfo: setDocumentInfo,
        logout: logout,
    };

    return(
        <AppContext.Provider value={contextData}>
            {props.children}
        </AppContext.Provider>
    );
};