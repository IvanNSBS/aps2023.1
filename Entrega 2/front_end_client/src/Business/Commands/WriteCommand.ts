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
        this.textEditorNode.innerText = this.newState;
        const child = !this.textEditorNode.lastChild ? this.textEditorNode : this.textEditorNode.lastChild;
        const offset = child.textContent ? child.textContent.length : 0;  
        this.selection.setPosition(child, offset);
        this.onExecuteClbk(this.newState);
    }

    public override undo(): void {
        this.textEditorNode.innerText = this.prevState;
        const child = !this.textEditorNode.lastChild ? this.textEditorNode : this.textEditorNode.lastChild;
        const offset = child.textContent ? child.textContent.length : 0;  
        this.selection.setPosition(child, offset);
        this.onExecuteClbk(this.prevState);
    }
}