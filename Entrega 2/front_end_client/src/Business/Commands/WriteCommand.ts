import { ICommand } from "./ICommand";

export class WriteCommand extends ICommand
{
    private prevState: string;
    private newState: string;
    private textEditorNode: HTMLDivElement;
    private onExecuteClbk: (newState: string) => void;

    constructor(textEditor: HTMLDivElement, prevState: string, newState: string, onExecute: (newState: string) => void){
        super();
        this.textEditorNode = textEditor;
        this.onExecuteClbk = onExecute;

        this.prevState = prevState;
        this.newState = newState;
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