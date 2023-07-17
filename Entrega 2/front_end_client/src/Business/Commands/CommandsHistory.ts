import { ICommand } from "./ICommand";

class CommandsHistory
{
    private execute_history: ICommand[] = [];
    private undo_history: ICommand[] = [];
    private history_size: number;

    constructor(history_size: number = 256)
    {
        this.history_size = history_size;
    }

    public add_command(cmd: ICommand)
    {
        cmd.execute();
        this.execute_history.push(cmd);

        if(this.execute_history.length > this.history_size)
            this.execute_history.shift();
    }

    public undo_last_command()
    {
        const cmd: ICommand | undefined = this.execute_history.pop();
        if(!cmd)
            return;

        cmd.undo();
        this.undo_history.push(cmd);
        if(this.undo_history.length > this.history_size)
            this.undo_history.shift();
    }

    public redo_last_command()
    {
        const cmd: ICommand | undefined = this.undo_history.pop();
        if(!cmd)
            return;

        cmd.undo();
        this.execute_history.push(cmd);
        if(this.execute_history.length > this.history_size)
            this.execute_history.shift();
    }
}