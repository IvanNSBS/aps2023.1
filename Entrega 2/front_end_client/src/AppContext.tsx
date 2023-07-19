import React, { FC, ReactElement, ReactNode, useRef, useState } from "react";
import { CommandsHistory } from "./Business/Commands/CommandsHistory"
import { ItemInfo } from "./Controllers/ProjectsPresenter";

type AppCtx = {
    getUserId(): string;
    setUserId(newId: string): void;
    getCurrentProjectInfo():ItemInfo | undefined;
    setCurrentProjectInfo(newInfo: ItemInfo | undefined): void;
    getCurrentDocumentInfo():ItemInfo | undefined;
    setCurrentDocumentInfo(newInfo: ItemInfo | undefined): void;
    getCmdHistory(): CommandsHistory;
}

type AppCtxProviderProps = {
    children: ReactNode;
}

export const AppContext = React.createContext<AppCtx | null>(null);

export const AppContextProvider: FC<AppCtxProviderProps> = (props:AppCtxProviderProps): ReactElement => {
    const cmdHistory = useRef<CommandsHistory>(new CommandsHistory(128));
    const [userId, setUserId] = useState<string>("$$NO_USER$$");
    const [projectInfo, setProjectInfo] = useState<ItemInfo|undefined>(undefined);
    const [documentInfo, setDocumentInfo] = useState<ItemInfo|undefined>(undefined);

    const contextData: AppCtx = {
        getUserId: () => userId,
        setUserId: setUserId,
        getCurrentProjectInfo: () => projectInfo,
        setCurrentProjectInfo: setProjectInfo,
        getCurrentDocumentInfo: () => projectInfo,
        setCurrentDocumentInfo: setDocumentInfo,
        getCmdHistory: () => cmdHistory.current
    };

    return(
        <AppContext.Provider value={contextData}>
            {props.children}
        </AppContext.Provider>
    );
};