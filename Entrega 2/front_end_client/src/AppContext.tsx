import React, { FC, ReactElement, ReactNode, useRef, useState } from "react";
import { CommandsHistory } from "./Business/Commands/CommandsHistory"

type AppCtx = {
    getUserId(): string;
    setUserId(newId: string): void;
    getCmdHistory(): CommandsHistory;
}

type AppCtxProviderProps = {
    children: ReactNode;
}

export const AppContext = React.createContext<AppCtx | null>(null);

export const AppContextProvider: FC<AppCtxProviderProps> = (props:AppCtxProviderProps): ReactElement => {
    const cmdHistory = useRef<CommandsHistory>(new CommandsHistory(64));
    const [userId, setUserId] = useState<string>("$$NO_USER$$");

    const contextData: AppCtx = {
        getUserId: () => userId,
        setUserId: setUserId,
        getCmdHistory: () => cmdHistory.current
    };

    return(
        <AppContext.Provider value={contextData}>
            {props.children}
        </AppContext.Provider>
    );
};