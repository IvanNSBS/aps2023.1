import { ReactElement, FC, useEffect, useState } from "react";
import { DocumentController } from "../../Controllers/DocumentController";

type TextEditorTimerProps = {
    controller: DocumentController;
    documentId: string | undefined;
    docDiv: React.RefObject<HTMLDivElement>;
};

export const TextEditorTimers: FC<TextEditorTimerProps> = (props: TextEditorTimerProps) => {
    const controller = props.controller;
    let interval: NodeJS.Timer;
    let grammarInterval: NodeJS.Timer;
    
    const [currentContent, setCurrentContent] = useState<string>("");

    useEffect(() => {
        interval = setInterval(() => {
            if(!props.documentId) {
                console.error("On document page but there's no document id. This shouldn't be possible");
                return;
            }
            
            if(!props.docDiv || !props.docDiv.current) {
                console.error("On document page but there's no reference to doc html div. This shouldn't be possible");
                return;
            }

            const docContent = props.docDiv.current.innerText;
            controller.saveDocument(props.documentId, docContent);
            console.log("Saving document...\n" + docContent);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(props.docDiv && props.docDiv.current) {
            setCurrentContent(props.docDiv.current.innerText);
            console.log("setting current content! " + props.docDiv.current.innerText);
        }

        grammarInterval = setInterval(() => {
            console.log("Grammar interval....")
        }, 8000)

        return () => clearInterval(grammarInterval);
    }, []);

    return null;
}