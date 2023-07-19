import axios from "axios"

export type ItemInfo = {
    id: string;
    name: string;
}

export class ProjectsPresenter
{
    private url: string = "http://127.0.0.1:5000/projects";

    public async createProject(userId: string, projectName: string) : Promise<ItemInfo | undefined>
    {
        const endpoint = `${this.url}/create_project`;
        try
        {
            const jsonData = {
                "user_id": userId,
                "project_name": projectName
            }
            const {data} = await axios.post(endpoint, jsonData);
            return {
                id: data,
                name: projectName
            };
        }
        catch(error)
        {
            return undefined;
        }
    }

    public async addDocumentToProject(projectId: string, documentName: string) : Promise<ItemInfo | undefined>
    {
        const endpoint = `${this.url}/create_document`;
        try
        {
            const jsonData = {
                "project_id": projectId,
                "document_name": documentName,
            }
            const {data} = await axios.post(endpoint, jsonData);
            return {
                id: data,
                name: documentName
            };
        }
        catch(error)
        {
            return undefined;
        }
    }

    public async getAllUserProjects(userId: string) : Promise<ItemInfo[] | undefined>
    {
        const endpoint = `${this.url}/get_user_projects/${userId}`;
        try
        {
            const res = await axios.get(endpoint);
            const data = res.data;
            let projectsInfo: ItemInfo[] = [];

            for(let i = 0; i < data.length; i++)
            {
                let projectInfo = data[i];
                const projectName = projectInfo.name;
                const projectId = projectInfo.id;

                projectsInfo.push({
                    id: projectId,
                    name: projectName
                });
            }
            
            return projectsInfo;
        }
        catch(error)
        {
            return undefined;
        }
    }

    public getAllProjectDocuments(projectId: string)
    {

    }
}