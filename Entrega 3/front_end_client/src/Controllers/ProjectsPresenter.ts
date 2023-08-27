import axios from "axios"
import { CurrentSession } from "../Data/CurrentSession";
import ServicePorts from "../ServicePorts";

export type ItemInfo = {
    id: string;
    name: string;
    ownerId: string;
}

export class ProjectsPresenter
{
    private url: string = `http://127.0.0.1:${ServicePorts.PROJECTS_SERVICE}/projects`;

    public async createProject(session: CurrentSession, projectName: string) : Promise<ItemInfo | undefined>
    {
        const endpoint = `${this.url}/create_project`;
        try
        {
            const jsonData = {
                "session": session,
                "project_name": projectName
            }
            const {data} = await axios.post(endpoint, jsonData);
            return {
                id: data.id,
                name: data.name,
                ownerId: data.user
            };
        }
        catch(error)
        {
            return undefined;
        }
    }

    public async getAllUserProjects(session: CurrentSession) : Promise<ItemInfo[] | undefined>
    {
        const endpoint = `${this.url}/get_user_projects`;
        try
        {
            const jsonData = {
                "session": session,
            }
            const res = await axios.post(endpoint, jsonData);

            const data = res.data;
            let projectsInfo: ItemInfo[] = [];

            for(let i = 0; i < data.length; i++)
            {
                let projectInfo = data[i];
                const projectName = projectInfo.name;
                const projectId = projectInfo.id;
                const ownerId = projectInfo.ownerId;

                projectsInfo.push({
                    id: projectId,
                    name: projectName,
                    ownerId: ownerId
                });
            }
            
            return projectsInfo;
        }
        catch(error)
        {
            return undefined;
        }
    }

    public async changeProjectName(session: CurrentSession, projectId: string, newName: string): Promise<boolean> {
        
        try
        {
            const endpoint = `${this.url}/change_project_name`;
            const jsonData = {
                "session": session,
                "project": {
                    "id": projectId,
                    "name": "",
                    "user": session.user.id
                },
                "new_project_name": newName
            }
            const {data} = await axios.put(endpoint, jsonData);
            return data;
        }
        catch
        {
            return false;
        }
    }

    public async deleteProject(projectId: string) : Promise<boolean> {
        try
        {
            const endpoint = `${this.url}/delete_project/${projectId}`;
            const {data} = await axios.delete(endpoint);
            return data;
        }
        catch
        {
            return false;
        }
    }

    public async addDocumentToProject(project: ItemInfo, documentName: string) : Promise<ItemInfo | undefined>
    {
        const endpoint = `${this.url}/create_document`;
        try
        {
            const jsonData = {
                "project":{
                    "id": project.id,
                    "name": project.name,
                    "user": project.ownerId
                },
                "doc_name": documentName
            }
            const {data} = await axios.post(endpoint, jsonData);
            console.log(data);
            return {
                id: data.id,
                name: data.name,
                ownerId: data.projectId
            };
        }
        catch(error)
        {
            return undefined;
        }
    }

    public async getAllProjectDocuments(project: ItemInfo): Promise<ItemInfo[] | undefined>
    {
        const endpoint = `${this.url}/get_project_documents/${project.id}`;
        try
        {
            const res = await axios.get(endpoint);
            const data = res.data;
            let documentsInfo: ItemInfo[] = [];

            for(let i = 0; i < data.length; i++)
            {
                let docInfo = data[i];
                const docId = docInfo.id;
                const docName = docInfo.name;
                const projectId = docInfo.projectId;

                documentsInfo.push({
                    id: docId,
                    name: docName,
                    ownerId: projectId
                });
            }
            
            return documentsInfo;
        }
        catch(error)
        {
            return undefined;
        }
    }
}
