import axios from "axios"

export type ProjectInfo = {
    projectId: string;
    projectName: string;
}

export class ProjectsController
{
    private url: string = "http://127.0.0.1:5000/projects"
}
