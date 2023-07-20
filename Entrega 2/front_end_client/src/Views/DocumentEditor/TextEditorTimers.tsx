import { ReactElement, FC, useEffect, useState } from "react";
import { DocumentController } from "../../Controllers/DocumentController";
import { TokenChanges, TokenInfo, process_tokens } from "../../Business/TextEditor/TextEditorTokenizer";

type TextEditorTimerProps = {
    controller: DocumentController;
    documentId: string | undefined;
    docDiv: React.RefObject<HTMLDivElement>;
};

export const TextEditorTimers: FC<TextEditorTimerProps> = (props: TextEditorTimerProps) => {
    const controller = props.controller;
    let interval: NodeJS.Timer;
    let grammarInterval: NodeJS.Timer;
    let currentContent: string = "";
    let currentTokens: TokenInfo[] = [];

    const fetchGrammarSuggestions = async function(changes: TokenChanges[]) {
        await props.controller.getGrammarSuggestions(changes);
    };

    useEffect(() => {
        const fetchInitialData = async function() {
            if(!props.documentId)
                return;

            const content = await props.controller.getDocumentConcent(props.documentId);
            if(!content)
                return;
            
            currentContent = content;
            const [tokenInfo, tokenChanges] = process_tokens(content, currentTokens);
            currentTokens = tokenInfo;
        };
        fetchInitialData();

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
            // console.log("Saving document...\n" + docContent);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        grammarInterval = setInterval(() => {
            if(!props.docDiv.current)
                return;

            if(currentContent !== props.docDiv.current.innerText){
                console.log("Content changed since last grammar check!")
                currentContent = props.docDiv.current.innerText;
                const [tokenInfo, tokenChanges] = process_tokens(currentContent, currentTokens);
                currentTokens = tokenInfo;
                console.log(tokenInfo);
                console.log(tokenChanges);
                fetchGrammarSuggestions(tokenChanges);
            }
            else{
                // console.log("Content didn't change since last grammar check...")
            }
        }, 1000)

        return () => clearInterval(grammarInterval);
    }, []);

    return <></>;
}