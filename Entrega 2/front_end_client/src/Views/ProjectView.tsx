import React, { FC, ReactElement, useState } from 'react';
import AppRoutes from '../AppRoutes';
import ProjectGridItem from './ProjectGridItem';
import { styled } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

type ProjectsProps = {
}

const ProjectsContainer = styled.div`
    grid-auto-rows: 3fr;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
`

const Cont = styled.div`
`

const ProjectView: FC<ProjectsProps> = (props: ProjectsProps): ReactElement => {
    
    const [documents, setDocuments] = useState<string[] | []>([]);
    const { state } = useLocation();
    const navigate = useNavigate();

    const create_document = function() {
        let document_name = prompt("Digite o nome do documento", "Novo Documento");
        
        if (document_name == null || document_name == "") {
            console.log("canceled create document prompt");
        } 
        else 
        {
            let name_exists = documents.find(x => x == document_name) !== undefined;
            if (name_exists)
                alert("Já existe um documento com este nome.")
            else
                setDocuments([...documents, document_name])
        } 
    }

    const on_click_document = function(document_name: string) {
        console.log(`Clicked on document: ${document_name}`)
        const navigate_data = { state: { document_name: document_name} };
        navigate(AppRoutes.edit_document, navigate_data);
    }

    return (
        <div>
            <span>
                <p>{state.project_name} View</p>
            </span>
            <Cont>
                <ProjectsContainer>
                    {
                        documents.map((item, index) => 
                            <ProjectGridItem name={item} key={index} on_click={() => on_click_document(item)}></ProjectGridItem>
                        )
                    }
                </ProjectsContainer>
                <button onClick={() => navigate(-1)}>Voltar</button>
            </Cont>
            <button onClick={create_document}>Criar Novo Documento</button>
            <a href={AppRoutes.login}>Logout</a>
        </div>
    )
}

export default ProjectView;