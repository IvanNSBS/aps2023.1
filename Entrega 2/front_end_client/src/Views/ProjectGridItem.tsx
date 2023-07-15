import React, { FC, ReactElement } from 'react';
import { styled } from 'styled-components';

type ProjectItemProps = {
    name: string
    on_click?: () => void
}

const ProjectGridItemContent = styled.form`
    display: flex;    
    justify-content: center;
    align-items: center;
    text-align: center;
    
    border: 1px solid black;
    font-size: 1.5em;
    width: 130px;
    height: 80px;
    margin: 3px;
    user-select: none;

    &:hover{
        background-color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    &:active{
        background-color: rgba(0, 0, 0, 0.5);
    }
`

const ProjectGridItem: FC<ProjectItemProps> = (props: ProjectItemProps): ReactElement => {
    return (
        <ProjectGridItemContent onClick={props.on_click}>
           {props.name}
        </ProjectGridItemContent>
    )
}

export default ProjectGridItem;