import React, { FC, ReactElement, useState } from 'react';
import AppRoutes from '../AppRoutes';
import ProjectGridItem from './ProjectGridItem';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const AllProjectsView: FC<ProjectsProps> = (props: ProjectsProps): ReactElement => {
    
    const [projects, setProjects] = useState<string[] | []>([]);
    const navigate = useNavigate();

    const create_project = function() {
        let project_name = prompt("Digite o nome do projecto", "Novo Projeto");
        
        if (project_name == null || project_name == "") {
            console.log("canceled create project prompt");
        } 
        else 
        {
            let name_exists = projects.find(x => x == project_name) !== undefined;
            if (name_exists)
                alert("Já existe um projeto com este nome.")
            else
                setProjects([...projects, project_name])
        } 
    }

    const on_click_project = function(proj_name: string) {
        console.log(`Clicked on project: ${proj_name}`);
        navigate(AppRoutes.project_view);
    }

    return (
        <div>
            <span>
                <p>Projects View</p>
                <a href={AppRoutes.login}>Logout</a>
            </span>
            <Cont>
                <ProjectsContainer>
                    {
                        projects.map((item, index) => 
                            <ProjectGridItem name={item} key={index} on_click={() => on_click_project(item)} ></ProjectGridItem>
                        )
                    }
                </ProjectsContainer>
            </Cont>
            <button onClick={create_project}>Criar Novo Projeto</button>
        </div>
    )
}

export default AllProjectsView;