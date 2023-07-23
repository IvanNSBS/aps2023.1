import { ReactElement, FC, useEffect, useState, useContext } from "react";
import { DocumentController } from "../../Controllers/DocumentController";
import { TokenChanges, TokenInfo, process_tokens } from "../../Business/TextEditor/TextEditorTokenizer";
import { GrammarSuggestionInfo } from "./TextEditor";
import { select_token } from "../../Business/TextEditor/TextTokenSelector";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { AppContext } from "../../AppContext";

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
    const appContext = useContext(AppContext);

    const fetchGrammarSuggestions = async function(tokens: TokenInfo[]) {
        const docDiv = props.docDiv;
        const node = docDiv.current;
        if(!docDiv || !node){
            console.error("docDiv props is undefined. This shouldn't be possible.")
            return;
        }

        const output = await props.controller.getGrammarSuggestions(tokens);
        let suggestions: GrammarSuggestionInfo[] = [];

        for(let i = 0; i < output.length; i++)
        {
            suggestions.push({
                tokenInfo: output[i].token,
                suggestion: output[i].suggestion,
                rect: select_token(node, output[i].token).getBoundingClientRect()
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
            if(!controller.saveDocument(props.documentId, docContent)){
                alert("Sem conexão com o DB. Não foi possivel salvar o documento...");
                appContext?.logout();
            }
                
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
                fetchGrammarSuggestions(props.tokensInfo.current);
            }
            else{
                // console.log("Content didn't change since last grammar check...")
            }
        }, 10000)

        return () => clearInterval(grammarInterval);
    }, []);

    return <></>;
}