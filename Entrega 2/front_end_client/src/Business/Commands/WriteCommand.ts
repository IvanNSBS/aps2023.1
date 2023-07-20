import { ICommand } from "./ICommand";

export class WriteCommand extends ICommand
{
    private prevCaretPosition: number;
    private newCaretPosition: number;
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
        this.prevCaretPosition = this.getCaretPosition();
        this.newCaretPosition = this.getCaretPosition();
    }

    private getCaretPosition() {
        const temp = document.createTextNode("\0");
        this.selection.getRangeAt(0).insertNode(temp);
        const caretPosition = this.textEditorNode.innerText.indexOf("\0");
        temp.parentNode?.removeChild(temp);

        return caretPosition;
    }

    private moveCaretPosition(caretPosition: number)
    {
        const start = this.selection.focusNode;
        if(!start)
            return;

        let prevSize = 0;
        let size = 0;
        let childNode = null;
        for(let i = 0; i < start.childNodes.length; i++)
        {
            const l = start.childNodes[i].textContent?.length;
            if(!l){
                size = size + 1;
                continue;
            }
            
            size = size + l;
            if(size >= caretPosition) {
                childNode = start.childNodes[i];
                prevSize = size - l;
                break;
            }
        }
        if(childNode !== null)
        {
            const deltaC = caretPosition - prevSize - 1;
            const offset = deltaC + 1 >= 0 ? deltaC + 1 : 0;
            this.selection.setPosition(childNode, offset);
        }
        else
        {
            const child = !this.textEditorNode.lastChild ? this.textEditorNode : this.textEditorNode.lastChild;
            const offset = child.textContent ? child.textContent.length : 0;
            this.selection.setPosition(child, offset);
        }
    }

    public override execute(): void {
        const length = this.newState.length;
        const a = this.newState.charAt(length-1);
        const b = this.newState.charAt(length-2);
        const trailingLineBreak: boolean = a !== "" && a === '\n' && b !== "" && b !== '\n'; 
        if(trailingLineBreak)
            this.newState = this.newState.slice(0, -1);

        this.textEditorNode.innerText = this.newState;
        this.moveCaretPosition(this.prevCaretPosition);
        this.onExecuteClbk(this.newState);

        this.newCaretPosition = this.getCaretPosition();
    }

    public override undo(): void {
        this.textEditorNode.innerText = this.prevState;
        this.moveCaretPosition(this.prevCaretPosition);
        this.onExecuteClbk(this.prevState);
    }
}