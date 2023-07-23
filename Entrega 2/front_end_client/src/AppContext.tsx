import React, { FC, ReactElement, ReactNode, useRef, useState } from "react";
import { CommandsHistory } from "./Business/Commands/CommandsHistory"
import { ItemInfo } from "./Controllers/ProjectsPresenter";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";

type AppCtx = {
    getUserId(): string;
    setUserId(newId: string): void;
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
    const [userId, setUserId] = useState<string>("$$NO_USER$$");
    const [projectInfo, setProjectInfo] = useState<ItemInfo|undefined>(undefined);
    const [documentInfo, setDocumentInfo] = useState<ItemInfo|undefined>(undefined);
    const navigate = useNavigate();

    const logout = function(){
        setUserId("$$NO_USER$$");
        setProjectInfo(undefined);
        setDocumentInfo(undefined);
        navigate(AppRoutes.login);
    }

    const contextData: AppCtx = {
        getUserId: () => userId,
        setUserId: setUserId,
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