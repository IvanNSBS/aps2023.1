import React, { FC, ReactElement } from 'react';
import AppRoutes from '../AppRoutes';

type ProjectsProps = {

}

const ProjectsView: FC<ProjectsProps> = (props: ProjectsProps): ReactElement => {
    return (
        <div>
            <p>Projects View</p>
            <a href={AppRoutes.login}>Logout</a>
        </div>
    )
}

export default ProjectsView;