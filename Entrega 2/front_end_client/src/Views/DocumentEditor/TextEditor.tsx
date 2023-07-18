import React, { FC, ReactElement, useState, useRef, useContext } from 'react';
import { styled } from 'styled-components';
import { process_tokens, TokenInfo, TokenChanges } from '../../Business/TextEditor/TextEditorTokenizer';
import { select_token } from '../../Business/TextEditor/TextTokenSelector';
import SuggestGrammarHighlight from './SuggestGrammarHighlight';
import { AppContext } from '../../AppContext';
import { AcceptGrammarSuggestionCommand } from '../../Business/Commands/AcceptGrammarSuggestionCommand';
import { WriteCommand } from '../../Business/Commands/WriteCommand';

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

const TextEditor: FC = (): ReactElement => {
  const [currentInnerText, setCurrentInnerText] = useState<string>("");
  const [tokenRect, setTokenRect] = useState<DOMRect>();
  const [tokenRange, setTokenRange] = useState<number>(0);
  const [tokenIndex, setTokenIndex] = useState<number>(0);

  const tokensInfo = useRef<TokenInfo[]>([]);
  const self = useRef<HTMLDivElement>(null);
  const appContext = useContext(AppContext);

  const updateTokens = function(new_text: string) {
    setCurrentInnerText(new_text);
    const [new_tokens, changes] = process_tokens(new_text, tokensInfo.current);
    tokensInfo.current = new_tokens;
    setTokenRange(new_tokens.length-1);
    console.log(new_tokens);
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
    if(!self || !self.current)
      return;

    const newText = evt.target.innerText;
    const writeCmd = new WriteCommand(self.current, currentInnerText, newText, updateTokens);
    appContext?.getCmdHistory().add_command(writeCmd);
  }

  const acceptGrammarSuggestion = function(token: TokenInfo, new_word: string): void {
    const selection = window.getSelection();
    if(!self || !self.current || !selection)
      return;
    
    var tk = tokensInfo.current.find(x => x.uuid === token.uuid);
    if(!tk)
      return;
    
    const select_range = select_token(self.current, tk);
    selection.removeAllRanges();
    selection.addRange(select_range);

    if(!selection.focusNode || !selection.focusNode.textContent)
      return;

    const acceptSuggestionCmd = new AcceptGrammarSuggestionCommand(self.current, selection.focusNode.textContent, token, new_word, updateTokens);
    appContext?.getCmdHistory().add_command(acceptSuggestionCmd);
  }

  const test_select = function() {
    if(self === null || self.current === null)
      return;

    const token = tokensInfo.current[tokenIndex];
    const select_range = select_token(self.current, token);
    setTokenRect(select_range.getBoundingClientRect());
    console.log(select_range.getBoundingClientRect());
  }
  
  const onSliderChange = function(new_val: any) {
    setTokenIndex(new_val.target.value);
  }

  let grammar = <></>
  if(tokenRect && self && self.current) {
    grammar = 
    <SuggestGrammarHighlight 
      rect={tokenRect} 
      word_suggestion='lorem ipsummmmmasdasdasdsam'
      word_token={tokensInfo.current[tokenIndex]}
      accept_grammar_suggestion={acceptGrammarSuggestion}
      cancel_suggest_grammar={() => setTokenRect(undefined)}/>
  }
  
  return (
    <TextContainer>
      <span>
        <button onClick={() => appContext?.getCmdHistory().undo_last_command()}>Desfazer</button>
        <button onClick={() => appContext?.getCmdHistory().redo_last_command()}>Refazer</button>
      </span>
      {grammar}
      <TextInput 
        ref={self} 
        contentEditable 
        suppressContentEditableWarning 
        spellCheck="false"
        onInput={onChange}
        onKeyDown={onKeyDown}>
      </TextInput>
      <span>
        <input type="range" min={0} max={tokenRange} onChange={onSliderChange}></input>
        <button onClick={test_select}> Test Select </button>
      </span>
    </TextContainer>
  );
}

export default TextEditor;