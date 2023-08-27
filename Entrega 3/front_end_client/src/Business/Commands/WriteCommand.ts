import { ICommand } from "./ICommand";

export class WriteCommand extends ICommand
{
    private prevState: string;
    private newState: string;
    private textEditorNode: HTMLDivElement;
    private selection: Selection;
    private onExecuteClbk: (newState: string) => void;

    constructor(textEditor: HTMLDivElement, selection: Selection, prevState: string, newState: string, onExecute: (newState: string) => void){
        super();
        this.textEditorNode = textEditor;
        this.selection = selection;
        this.onExecuteClbk = onExecute;

        this.prevState = prevState;
        this.newState = newState;
    }

    public override execute(): void {
        const length = this.newState.length;
        const a = this.newState.charAt(length-1);
        const b = this.newState.charAt(length-2);
        const trailingLineBreak: boolean = a !== "" && a === '\n' && b !== "" && b !== '\n'; 
        if(trailingLineBreak)
            this.newState = this.newState.slice(0, -1);

        this.textEditorNode.textContent = this.newState;
        this.onExecuteClbk(this.newState);
    }

    public override undo(): void {
        this.textEditorNode.innerText = this.prevState;
        this.onExecuteClbk(this.prevState);
    }
}