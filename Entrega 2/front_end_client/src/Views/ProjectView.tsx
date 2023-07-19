import React, { FC, ReactElement, useContext, useState } from 'react';
import AppRoutes from '../AppRoutes';
import ProjectGridItem from './ProjectGridItem';
import { styled } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ItemInfo, ProjectsPresenter } from '../Controllers/ProjectsPresenter';
import { AppContext } from '../AppContext';

type ProjectsProps = {
    projectsPresenter: ProjectsPresenter
}

const ProjectsContainer = styled.div`
    grid-auto-rows: 3fr;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
`

const Cont = styled.div`
`


const Header = styled.div`
    display: flex;
    justify-content: space-between;
`

const ProjectNameInput = styled.input`
    border: 0px;
    font-size: 18px;
    margin-bottom: 10px;
`

const ProjectView: FC<ProjectsProps> = (props: ProjectsProps): ReactElement => {
    const appCtx = useContext(AppContext);
    const projectsPresenter = props.projectsPresenter;
    const [documents, setDocuments] = useState<ItemInfo[]>([]);
    const [projectName, setProjectName] = useState<string>("");
    const navigate = useNavigate();

    useState(() => {
        const projectInfo = appCtx?.getCurrentProjectInfo();
        if(!projectInfo)
            return;

        setProjectName(projectInfo.name);
        const fetchData = async function(){
            const allDocs = await projectsPresenter.getAllProjectDocuments(projectInfo.id);
            if(!allDocs)
                return;

            setDocuments(allDocs);
        };

        fetchData();
    });

    const create_document = async function() {
        let document_name = prompt("Digite o nome do documento", "Novo Documento");
        
        if (document_name == null || document_name == "") {
            console.log("canceled create document prompt");
            return;
        } 
        let name_exists = documents.find(x => x.name == document_name) !== undefined;
        if (name_exists){
            alert("Já existe um documento com este nome.")
            return;
        }
        const projectInfo = appCtx?.getCurrentProjectInfo();
        if(!projectInfo)
            return;

        const newDoc = await projectsPresenter.addDocumentToProject(projectInfo.id, document_name);
        if(!newDoc)
            return;

        setDocuments([...documents, newDoc])
    }

    const on_click_document = function(document: ItemInfo) {
        console.log(`Clicked on document: ${document.name}`)
        appCtx?.setCurrentDocumentInfo(document);
        navigate(AppRoutes.edit_document);
    }

    const goToPreviousPage = function(){
        appCtx?.setCurrentProjectInfo(undefined);
        navigate(-1);
    }

    const changeProjectName = async function(evt: any){
        evt.preventDefault();
        const project = appCtx?.getCurrentProjectInfo();
        if(!project)
            return;

        const value = evt.target.value? evt.target.value : evt.target.project_name.value;
        const didntChange: boolean = value === projectName;
        if(didntChange){
            return;
        }

        setProjectName(value);
        projectsPresenter.changeProjectName(project.id, value);
    }

    const deleteDocument = async function(evt: any){
        const projectInfo = appCtx?.getCurrentProjectInfo();
        if(!projectInfo)
            return;

        if(await confirm("Você irá perder todos os documentos deste projecto. Tem certeza de que quer fazer isso?"))
        {
            const deleted = await projectsPresenter.deleteProject(projectInfo.id);
            if(deleted)
                navigate(-1);
            else
                alert("Não foi possível deletar o projeto.")
        }
    }

    return (
        <div>
            <Header>
                <form onSubmit={changeProjectName}>
                    <ProjectNameInput 
                        spellCheck="false"
                        defaultValue={appCtx?.getCurrentProjectInfo()?.name}
                        name="project_name"
                        onBlur={changeProjectName}
                    ></ProjectNameInput>
                </form>
                <div>
                    <button onClick={goToPreviousPage}>Voltar</button>
                    <button onClick={ () => appCtx?.logout() }>Logout</button>
                </div>
            </Header>
            <Cont>
                <ProjectsContainer>
                    {
                        documents.map((item, index) => 
                            <ProjectGridItem
                                id={item.id} 
                                name={item.name} 
                                key={item.id} 
                                on_click={() => on_click_document(item)}
                            ></ProjectGridItem>
                        )
                    }
                </ProjectsContainer>
            </Cont>
            <Header>
                <button onClick={create_document}>Criar Novo Documento</button>
                <button onClick={deleteDocument}>Deletar Projeto</button>
            </Header>
        </div>
    )
}

export default ProjectView;