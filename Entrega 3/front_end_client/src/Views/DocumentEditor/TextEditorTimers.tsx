import { ReactElement, FC, useEffect, useState, useContext } from "react";
import { DocumentController } from "../../Controllers/DocumentController";
import { TokenChanges, TokenInfo, process_tokens } from "../../Business/TextEditor/TextEditorTokenizer";
import { GrammarSuggestionInfo } from "./TextEditor";
import { select_token } from "../../Business/TextEditor/TextTokenSelector";
import { AppContext } from "../../AppContext";
import { TextEditorEventsPublisher, TextEditorEventsSubscriber, TextEditorSubjectClbks } from "./TextEditorObserver";

type TextEditorTimerProps = {
    controller: DocumentController;
    documentId: string | undefined;
    docDiv: React.RefObject<HTMLDivElement>;
    setSuggestionTokens(changes: GrammarSuggestionInfo[]): void;
    tokensInfo: React.RefObject<TokenInfo[]>;
    getEventsPublisher(): TextEditorEventsPublisher
};

export const TextEditorTimers: FC<TextEditorTimerProps> = (props: TextEditorTimerProps) => {
    const controller = props.controller;
    let interval: NodeJS.Timer;
    let grammarInterval: NodeJS.Timer;
    let currentContent: string = "";
    let textEditorObserver: TextEditorEventsSubscriber;
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

    const newGrammarInterval = function(){
        return setInterval(() => {
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
    }

    const newSaveDocInterval = function() {
        return setInterval(() => {
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
                
            console.log("Saving document...\n" + docContent);
        }, 1000);
    }

    const resetGrammarTimer = function() {
        console.log("resetting grammar timer...");
        clearInterval(grammarInterval);
        grammarInterval = newGrammarInterval();
    }

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
        interval = newSaveDocInterval();

        const clbks = {
            on_notify: resetGrammarTimer
        }
        textEditorObserver = new TextEditorEventsSubscriber(clbks);
        props.getEventsPublisher().subscribe(textEditorObserver);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        grammarInterval = newGrammarInterval();
        return () => clearInterval(grammarInterval);
    }, []);

    return <></>;
}