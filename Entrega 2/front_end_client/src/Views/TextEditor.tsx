import React, { FC, ReactElement, useState, useRef } from 'react';
import { styled } from 'styled-components';
import { process_tokens, TokenInfo, TokenChanges } from '../Business/TextEditorTokenizer';

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

  overflow: auto;
  padding: 10px;

  &:focus {
    outline: none;
  }
`

const TextEditor: FC = (): ReactElement => {
    const [words, setWords] = useState<string[] | []>([]);
    const tokensInfo = useRef<TokenInfo[]>([]);
    const self = useRef<HTMLDivElement>(null);

    const onChange = function(evt: any) {
      setWords(evt.target.innerText);
      const [new_tokens, changes] = process_tokens(evt.target.innerText, tokensInfo.current);
      tokensInfo.current = new_tokens;
      console.log(changes);
    }

    const test_select = function() {
      if(self === null || self.current === null)
        return;

      const tokens = tokensInfo.current;
      const tokenIdx = 0;
      let child = self.current.childNodes[tokens[tokenIdx].row];
      if(child.firstChild)
        child = child.firstChild;

      let range = new Range();
      range.setStart(child, tokens[tokenIdx].range_start);
      range.setEnd(child, tokens[tokenIdx].range_end);

      console.log(range.getBoundingClientRect());

      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
    }
    
    return (
      <TextContainer>
        <TextInput 
          ref={self} 
          contentEditable 
          suppressContentEditableWarning 
          spellCheck="false"
          onInput={onChange}>
        </TextInput> 
        <button onClick={test_select}> Test Select </button> 
      </TextContainer>
    );
}

export default TextEditor;