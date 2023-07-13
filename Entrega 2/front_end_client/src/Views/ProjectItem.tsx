import React, { FC, ReactElement } from 'react';

type ProjectItemProps = {
    name: string
}

const ProjectsView: FC<ProjectItemProps> = (props: ProjectItemProps): ReactElement => {
    return (
        <div>
            <p>{props.name}</p>
        </div>
    )
}

export default ProjectsView;