import React, { FC, ReactElement, useState, useRef } from 'react';
import { styled } from 'styled-components';

type TokenInfo = {
  word: string;
  row: number;
  range_start: number;
  range_end: number;
}

const process_tokens = function(page_content: string) {
  const words = page_content.split(/(\s+)/) || []; 
  const tokens:TokenInfo[] = [];
  console.log(`Tokens count: ${words.length}`)

  let current_row: number = 0;
  let range_start: number = 0;

  for(let i = 0; i < words.length; i++)
  {
    const is_line_break = /\r|\n/.exec(words[i]);
    const is_empty_str = words[i] == "";
    if(is_line_break)
    {
      words[i] = "$$line_break$$";
      current_row = current_row + 1;
      range_start = 0;
      continue;
    }
    if(is_empty_str)
    {
      words[i] = "$$empty$$";
      continue;
    }

    let range_end = range_start + words[i].length; 
    tokens.push({
      word: words[i], 
      row: current_row,
      range_start: range_start,
      range_end: range_end
    })
    range_start = range_end;
  }

  return tokens;
}

const TextEditor: FC = (): ReactElement => {
    const [words, setWords] = useState<string[] | []>([]);
    const tokensInfo = useRef<TokenInfo[]>([]);
    const self = useRef<HTMLDivElement>(null);

    const onChange = function(evt: any) {
      setWords(evt.target.innerText);
      const tokens = process_tokens(evt.target.innerText);
      tokensInfo.current = tokens;
      console.log(tokensInfo.current);
    }

    const test_select = function() {
      if(self === null || self.current === null)
        return;

      const tokens = tokensInfo.current;
      const tokenIdx = 7;
      let child = self.current.childNodes[tokens[tokenIdx].row];
      if(tokens[tokenIdx].row > 0 && child.firstChild)
        child = child.firstChild;
      console.log(child);

      let range = new Range();
      range.setStart(child, tokens[tokenIdx].range_start);
      range.setEnd(child, tokens[tokenIdx].range_end);

      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
    }
    
    return (
      <>
        <div ref={self} contentEditable suppressContentEditableWarning onInput={onChange}>
        </div> 
        <button onClick={test_select}> Test Select </button> 
      </>
    );
}

export default TextEditor;