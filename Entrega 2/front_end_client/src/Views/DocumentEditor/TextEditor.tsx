import React, { FC, ReactElement, useState, useRef, useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { process_tokens, TokenInfo, TokenChanges } from '../../Business/TextEditor/TextEditorTokenizer';
import { select_token } from '../../Business/TextEditor/TextTokenSelector';
import SuggestGrammarHighlight from './SuggestGrammarHighlight';
import { AppContext } from '../../AppContext';
import { AcceptGrammarSuggestionCommand } from '../../Business/Commands/AcceptGrammarSuggestionCommand';
import { WriteCommand } from '../../Business/Commands/WriteCommand';
import { TextEditorTimers } from './TextEditorTimers';
import { DocumentController } from '../../Controllers/DocumentController';
import { token } from 'stylis';

type TextEditorProps = {
  controller: DocumentController;
}

export type GrammarSuggestionInfo = {
  tokenInfo: TokenInfo,
  suggestion: string,
  rect: DOMRect
}

const TextContainer = styled.div`
  height: max(85vh, 350px);
  width: 750px;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`

const TextInput = styled.div`
  width: 100%;
  height: 90%;
  resize: none;
  background: white;
  color: black;
  border: 1px solid gray;

  overflow: auto;
  padding: 10px;

  &:focus {
    outline: none;
  }
`

const TextEditor: FC<TextEditorProps> = (props:TextEditorProps): ReactElement => {
  const [currentInnerText, setCurrentInnerText] = useState<string>("");
  const [suggestionTokens, setSuggestionTokens] = useState<GrammarSuggestionInfo[]>([]);

  const tokensInfo = useRef<TokenInfo[]>([]);
  const self = useRef<HTMLDivElement>(null);
  const appContext = useContext(AppContext);

  useEffect(() => {
    const fetchData = async function() {
      const docData = appContext?.getCurrentDocumentInfo();
      if(!docData || !self || !self.current)
        return;

      const content = await props.controller.getDocumentConcent(docData.id);
      if(content) {
        setCurrentInnerText(content);
        self.current.innerText = content;
        updateTokens(content);
      }
    }

    fetchData();
  }, []);

  const updateTokens = function(new_text: string) {
    setCurrentInnerText(new_text);
    const [new_tokens, changes] = process_tokens(new_text, tokensInfo.current);
    tokensInfo.current = new_tokens;
  }

  const onKeyDown = function(evt: any) {
    if(evt.ctrlKey)
    {
      if(evt.code === "KeyZ"){
        evt.preventDefault();
        appContext?.getCmdHistory().undo_last_command();
      }
      if(evt.code === "KeyY"){
        evt.preventDefault();
        appContext?.getCmdHistory().redo_last_command();
      }
    }
  }

  const onChange = function(evt: any) {
    const selection = getSelection();
    if(!self || !self.current || !selection)
      return;

    const newText = evt.target.innerText;
    const writeCmd = new WriteCommand(self.current, selection, currentInnerText, newText, updateTokens);
    appContext?.getCmdHistory().add_command(writeCmd);

    console.log(self.current);
    console.log(newText);
  }

  const acceptGrammarSuggestion = function(token: TokenInfo, new_word: string): void {
    const selection = window.getSelection();
    if(!self || !self.current || !selection)
      return;
    
    var tk = tokensInfo.current.find(x => x.uuid === token.uuid);
    if(!tk){
      console.log("Token not found :(");
      console.log(tokensInfo);
      console.log(token.uuid);
      return;
    }
    
    const select_range = select_token(self.current, tk);
    selection.removeAllRanges();
    selection.addRange(select_range);

    if(!selection.focusNode || !selection.focusNode.textContent)
      return;

    const acceptSuggestionCmd = new AcceptGrammarSuggestionCommand(self.current, selection.focusNode.textContent, token, new_word, updateTokens);
    appContext?.getCmdHistory().add_command(acceptSuggestionCmd);
  }

  return (
    <TextContainer>
      <TextEditorTimers
        docDiv={self}
        documentId={appContext?.getCurrentDocumentInfo()?.id}
        setSuggestionTokens={setSuggestionTokens}
        controller={props.controller}
        tokensInfo={tokensInfo}
      />
      <span>
        <button onClick={() => appContext?.getCmdHistory().undo_last_command()}>Desfazer</button>
        <button onClick={() => appContext?.getCmdHistory().redo_last_command()}>Refazer</button>
      </span>
      {
        suggestionTokens.map((item, index) =>
          <SuggestGrammarHighlight
            key={item.tokenInfo.uuid} 
            rect={item.rect} 
            word_suggestion={item.suggestion}
            word_token={item.tokenInfo}
            accept_grammar_suggestion={acceptGrammarSuggestion}
            cancel_suggest_grammar={() => {
              setSuggestionTokens(suggestionTokens.filter(x => x.tokenInfo.uuid !== item.tokenInfo.uuid))
            }}
          />
        )
      }
      <TextInput 
        ref={self} 
        contentEditable
        suppressContentEditableWarning 
        spellCheck="false"
        onInput={onChange}
        onKeyDown={onKeyDown}>
      </TextInput>
    </TextContainer>
  );
}

export default TextEditor;