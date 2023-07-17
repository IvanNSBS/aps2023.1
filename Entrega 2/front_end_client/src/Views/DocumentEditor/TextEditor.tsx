import React, { FC, ReactElement, useState, useRef } from 'react';
import { styled } from 'styled-components';
import { process_tokens, TokenInfo, TokenChanges } from '../../Business/TextEditor/TextEditorTokenizer';
import { select_token } from '../../Business/TextEditor/TextTokenSelector';
import SuggestGrammarHighlight from './SuggestGrammarHighlight';

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
    const [tokenRect, setTokenRect] = useState<DOMRect>();
    const [tokenRange, setTokenRange] = useState<number>(0);
    const [tokenIndex, setTokenIndex] = useState<number>(0);

    const tokensInfo = useRef<TokenInfo[]>([]);
    const self = useRef<HTMLDivElement>(null);

    const onChange = function(evt: any) {
      const [new_tokens, changes] = process_tokens(evt.target.innerText, tokensInfo.current);
      console.log(changes);
      
      tokensInfo.current = new_tokens;
      setTokenRange(new_tokens.length-1);
    }

    const test_select = function() {
      if(self === null || self.current === null)
        return;

      const token = tokensInfo.current[tokenIndex];
      const select_range = select_token(self.current, token);
      setTokenRect(select_range.getBoundingClientRect());
    }
    
    const onSliderChange = function(new_val: any) {
      setTokenIndex(new_val.target.value);
    }

    let grammar = <></>
    if(tokenRect && self && self.current) {
      grammar = <SuggestGrammarHighlight rect={tokenRect} word_suggestion='lorem ipsum'></SuggestGrammarHighlight>
    }
    
    return (
      <TextContainer>
        {grammar}
        <TextInput 
          ref={self} 
          contentEditable 
          suppressContentEditableWarning 
          spellCheck="false"
          onInput={onChange}>
        </TextInput>
        <span>
          <input type="range" min={0} max={tokenRange} onChange={onSliderChange}></input>
          <button onClick={test_select}> Test Select </button>
        </span>
      </TextContainer>
    );
}

export default TextEditor;