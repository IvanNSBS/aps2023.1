import { TokenInfo } from "../TextEditor/TextEditorTokenizer";
import { ICommand } from "./ICommand";

export class AcceptGrammarSuggestionCommand extends ICommand
{
    private prevState: string;
    private newState: string;
    private textEditorNode: HTMLDivElement;
    private onExecuteClbk: (newState: string) => void;

    constructor(textEditor: HTMLDivElement, prevState: string, word_token: TokenInfo, new_word: string, onExecute: (newState: string) => void){
        super();
        this.textEditorNode = textEditor;
        this.onExecuteClbk = onExecute;

        this.prevState = prevState;
        let new_text = prevState.substring(0, word_token.range_start) + new_word + prevState.substring(word_token.range_end, prevState.length);
        this.newState = new_text;
    }

    public override execute(): void {
        this.textEditorNode.textContent = this.newState;
        this.onExecuteClbk(this.newState);
    }

    public override undo(): void {
        this.textEditorNode.textContent = this.prevState;
        this.onExecuteClbk(this.prevState);
    }
}