import { ReactElement, FC, useEffect } from "react";
import { DocumentController } from "../../Controllers/DocumentController";

type TextEditorTimerProps = {
    controller: DocumentController;
    documentId: string | undefined;
    docDiv: React.RefObject<HTMLDivElement>;
};

export const TextEditorTimers: FC<TextEditorTimerProps> = (props: TextEditorTimerProps) => {
    const controller = props.controller;
    let interval: NodeJS.Timer;
    
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
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return null;
}