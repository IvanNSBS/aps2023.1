import React, { FC, ReactElement, useState, useRef } from 'react';
import { styled } from 'styled-components';

type TokenInfo = {
  word: string;
  row: number;
  range_start: number;
  range_end: number;
};

enum ChangeState {
  DELETED,
  NEW,
  CHANGED
};

type TokenChanges = {
  prev_token?: TokenInfo;
  new_token?: TokenInfo;
  change_state: ChangeState;
};

const compare_tokens = function(a: TokenInfo, b: TokenInfo): boolean {
  return a.word === b.word && 
         a.row === b.row && 
         a.range_start === b.range_start && 
         a.range_end === b.range_end;
}

const process_tokens = function(page_content: string, prev_tokens: TokenInfo[]) : [TokenInfo[], TokenChanges[]]
{
  const words = page_content.split(/(\s+)/) || []; 
  const tokens: TokenInfo[] = [];
  const changes: TokenChanges[] = [];

  let current_row: number = 0;
  let range_start: number = 0;

  for(let i = 0; i < words.length; i++)
  {
    const is_line_break = /\r|\n/.exec(words[i]);
    const is_empty_str = words[i] == "";

    if(is_line_break)
    {
      current_row = current_row + 1;
      range_start = 0;
      continue;
    }
    if(is_empty_str)
    {
      continue;
    }

    let range_end = range_start + words[i].length;
    tokens.push({
      word: words[i], 
      row: current_row,
      range_start: range_start,
      range_end: range_end
    });
    range_start = range_end;
  }

  const range = tokens.length > prev_tokens.length ? tokens.length : prev_tokens.length; 
  for(let i = 0; i < range; i++)
  {
    const is_new: boolean = i >= prev_tokens.length;
    const removed: boolean = prev_tokens.length > tokens.length && i >= tokens.length;

    if(is_new)
    {
      changes.push({
        prev_token: undefined,
        new_token: tokens[i],
        change_state: ChangeState.NEW
      });
    }
    else if(removed)
    {
      changes.push({
        prev_token: tokens[i],
        new_token: undefined,
        change_state: ChangeState.DELETED
      });
    }
    else if(i < tokens.length && i < prev_tokens.length)
    {
      const changed: boolean = !compare_tokens(prev_tokens[i], tokens[i]);
      if(changed)
      {
        changes.push({
          prev_token: prev_tokens[i],
          new_token: tokens[i],
          change_state: ChangeState.CHANGED
        });
      }
    }
  }

  return [tokens, changes];
}

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
      <>
        <div ref={self} contentEditable suppressContentEditableWarning onInput={onChange}>
        </div> 
        <button onClick={test_select}> Test Select </button> 
      </>
    );
}

export default TextEditor;