import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import AppRoutes from '../AppRoutes';
import ProjectGridItem from './ProjectGridItem';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ItemInfo, ProjectsPresenter } from '../Controllers/ProjectsPresenter';
import { AppContext } from '../AppContext';

type ProjectsProps = {
    projectsPresenter: ProjectsPresenter;
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
    const projectsPresenter = props.projectsPresenter;
    const appCtx = useContext(AppContext);
    const [projects, setProjects] = useState<ItemInfo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userId: string | undefined = appCtx?.getUserId();
        if(!userId)
            return;
        
        const fetchProjects = async () => {
            const allProjects = await projectsPresenter.getAllUserProjects(userId);
            if(!allProjects)
                return;
            
            console.log(allProjects);
            setProjects(allProjects);
        }

        fetchProjects();
    }, []);

    const create_project = function() {
        let project_name = prompt("Digite o nome do projecto", "Novo Projeto");
        
        // if (project_name == null || project_name == "") {
        //     console.log("canceled create project prompt");
        // } 
        // else 
        // {
        //     let name_exists = projects.find(x => x.name == project_name) !== undefined;
        //     if (name_exists)
        //         alert("Já existe um projeto com este nome.")
        //     else
        //         setProjects([...projects, project_name])
        // } 
    }

    const on_click_project = function(item: ItemInfo) {
        console.log(`Clicked on project: ${item.name}`);
        const navigate_data = { state: { project_name: item.name} };
        navigate(AppRoutes.project_view, navigate_data);
    }

    return (
        <div>
            <span>
                <p>All Projects View</p>
            </span>
            <Cont>
                <ProjectsContainer>
                    {
                        projects.map((item, index) =>
                            <ProjectGridItem 
                                id={item.id}
                                name={item.name} 
                                key={item.id} 
                                on_click={() => on_click_project(item)}
                            ></ProjectGridItem>
                        )
                    }
                </ProjectsContainer>
            </Cont>
            <button onClick={create_project}>Criar Novo Projeto</button>
            <a href={AppRoutes.login}>Logout</a>
        </div>
    )
}

export default AllProjectsView;