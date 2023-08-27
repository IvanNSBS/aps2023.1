export interface TextEditorSubjectClbks{
    on_notify(): void;
}

export class TextEditorEventsPublisher {
    private subjects: TextEditorEventsSubscriber[] = []

    public notifyKeystroke(): void
    {
        for(let i = 0; i < this.subjects.length; i++)
        {
            this.subjects[i].invoke();
        }
    }

    public subscribe(subject: TextEditorEventsSubscriber) 
    {
        this.subjects.push(subject); 
    }

    public unsubscribe(subject: TextEditorEventsSubscriber)
    {
        const idx = this.subjects.indexOf(subject);
        this.subjects.splice(idx, 1);
    }
}

export class TextEditorEventsSubscriber 
{
    private clbk: TextEditorSubjectClbks;

    constructor(clbk: TextEditorSubjectClbks)
    {
        this.clbk = clbk;
    }

    public invoke() { this.clbk.on_notify() }
}