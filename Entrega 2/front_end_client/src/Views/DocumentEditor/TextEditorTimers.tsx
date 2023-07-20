import { ReactElement, FC, useEffect, useState } from "react";
import { DocumentController } from "../../Controllers/DocumentController";
import { TokenChanges, TokenInfo, process_tokens } from "../../Business/TextEditor/TextEditorTokenizer";
import { GrammarSuggestionInfo } from "./TextEditor";
import { select_token } from "../../Business/TextEditor/TextTokenSelector";

type TextEditorTimerProps = {
    controller: DocumentController;
    documentId: string | undefined;
    docDiv: React.RefObject<HTMLDivElement>;
    setSuggestionTokens(changes: GrammarSuggestionInfo[]): void;
    tokensInfo: React.RefObject<TokenInfo[]>;
};

export const TextEditorTimers: FC<TextEditorTimerProps> = (props: TextEditorTimerProps) => {
    const controller = props.controller;
    let interval: NodeJS.Timer;
    let grammarInterval: NodeJS.Timer;
    let currentContent: string = "";

    const fetchGrammarSuggestions = async function(changes: TokenChanges[]) {
        const docDiv = props.docDiv;
        const node = docDiv.current;
        if(!docDiv){
            console.error("docDiv props is undefined. This shouldn't be possible.")
        }

        console.log("fetch grammar changes:")
        console.log(changes);
        const output = await props.controller.getGrammarSuggestions(changes);
        let suggestions: GrammarSuggestionInfo[] = [];

        for(let i = 0; i < output.length; i++)
        {
            const prevToken = output[i].prev_token; 
            const newToken = output[i].new_token; 
            if(!prevToken || !newToken)
                continue;
            if(!node)
                continue;

            suggestions.push({
                tokenInfo: prevToken,
                suggestion: newToken.word,
                rect: select_token(node, prevToken).getBoundingClientRect()
            });
        }

        props.setSuggestionTokens(suggestions);
    };

    useEffect(() => {
        const fetchInitialData = async function() {
            if(!props.documentId)
                return;

            const content = await props.controller.getDocumentConcent(props.documentId);
            if(!content)
                return;
            
            currentContent = content;
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
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        grammarInterval = setInterval(() => {
            if(!props.docDiv.current)
                return;

            if(currentContent !== props.docDiv.current.innerText) {
                if(!props.tokensInfo || !props.tokensInfo.current){
                    return;
                }

                console.log("Content changed since last grammar check!")
                currentContent = props.docDiv.current.innerText;
                const [tokenInfo, tokenChanges] = process_tokens(currentContent, props.tokensInfo.current);
                console.log(tokenInfo);
                console.log(tokenChanges);
                fetchGrammarSuggestions(tokenChanges);
            }
            else{
                // console.log("Content didn't change since last grammar check...")
            }
        }, 10000)

        return () => clearInterval(grammarInterval);
    }, []);

    return <></>;
}