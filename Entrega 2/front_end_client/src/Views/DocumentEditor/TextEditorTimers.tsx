import { ReactElement, FC, useEffect } from "react";
import { DocumentController } from "../../Controllers/DocumentController";

type TextEditorTimerProps = {
    controller: DocumentController;
};

export const TextEditorTimers: FC<TextEditorTimerProps> = (props: TextEditorTimerProps) => {
    const controller = props.controller;
    let interval: NodeJS.Timer;
    
    useEffect(() => {
        interval = setInterval(() => {
            console.log("Running interval every second...");
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return null;
}