import { TokenInfo } from "./TextEditorTokenizer";

export const select_token = function(editor_div: HTMLDivElement, word_token: TokenInfo): Range
{
    let child = editor_div.childNodes[word_token.row];
    if(child.firstChild)
      child = child.firstChild;

    let range = new Range();
    range.setStart(child, word_token.range_start);
    range.setEnd(child, word_token.range_end);

    return range;
    console.log(range.getBoundingClientRect());
}