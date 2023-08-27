import { randomUUID } from "crypto";
import {v4 as uuidv4} from "uuid";

export type TokenInfo = {
    uuid: string;
    word: string;
    row: number;
    range_start: number;
    range_end: number;
};

export enum ChangeState {
    DELETED,
    NEW,
    CHANGED
};

export type TokenChanges = {
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

export const process_tokens = function(page_content: string, prev_tokens: TokenInfo[]) : [TokenInfo[], TokenChanges[]]
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
            const break_count = Math.ceil(words[i].length / 2);
            current_row = current_row + break_count;
            range_start = 0;
            continue;
        }
        if(is_empty_str)
        {
            continue;
        }

        let range_end = range_start + words[i].length;
        tokens.push({
            uuid: uuidv4(),
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
            tokens[i].uuid = prev_tokens[i].uuid;
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