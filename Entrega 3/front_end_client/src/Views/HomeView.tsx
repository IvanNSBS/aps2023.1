import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import AppRoutes from '../AppRoutes';
import ProjectGridItem from './ProjectGridItem';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ItemInfo, ProjectsPresenter } from '../Controllers/ProjectsPresenter';
import { AppContext } from '../AppContext';
import { CurrentSession } from '../Data/CurrentSession';

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

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`

const HomeView: FC<ProjectsProps> = (props: ProjectsProps): ReactElement => {
    const projectsPresenter = props.projectsPresenter;
    const appCtx = useContext(AppContext);
    const [projects, setProjects] = useState<ItemInfo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const session: CurrentSession | undefined = appCtx?.getSession();
        if(!session)
            return;
        
        const fetchProjects = async () => {
            const allProjects = await projectsPresenter.getAllUserProjects(session);
            if(!allProjects)
                return;
            
            console.log(allProjects);
            setProjects(allProjects);
        }

        fetchProjects();
    }, []);

    const create_project = async function() {
        let project_name = prompt("Digite o nome do projecto", "Novo Projeto");
        
        if (project_name == null || project_name == "") {
            console.log("canceled create project prompt");
        } 
        else 
        {
            let name_exists = projects.find(x => x.name == project_name) !== undefined;
            if (name_exists){
                alert("Já existe um projeto com este nome.")
                return;
            }

            const session = appCtx?.getSession();
            if(!session){
                alert("no user is logged in");
                return;
            }

            const createdProject = await projectsPresenter.createProject(session, project_name);
            if(!createdProject){
                alert("Could not create project");
                return;
            }
            
            setProjects([...projects, createdProject])
        } 
    }

    const on_click_project = function(item: ItemInfo) {
        console.log(`Clicked on project: ${item.name}`);
        appCtx?.setCurrentProjectInfo(item);
        navigate(AppRoutes.project_view);
    }

    const goToUserSettings = function(){
        navigate(AppRoutes.user_settings);
    }

    return (
        <div>
            <Header>
                <p>All Projects View</p>
                <div>
                    <button onClick={goToUserSettings}>Settings</button>
                    <button onClick={ () => appCtx?.logout() }>Logout</button>
                </div>
            </Header>
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
        </div>
    )
}

export default HomeView;