import React from 'react'
import {ProjectRowsProps, ProjectsContainer} from '@/types/info'
import Element = React.JSX.Element
import ReactNode = React.ReactNode
import {Rows} from './Elements'

function getLink(
    state: string,
    port: string,
    projectRowsProps: ProjectRowsProps
): ReactNode {
    if (state !== 'running') {
        return '連結'
    }
    const urlWithPort: string = `${projectRowsProps.url}:${port}`
    return <a href={urlWithPort} target='_blank' rel='noopener noreferrer'>連結</a>
}

function getSetTitleClick(
    projectRowsProps: ProjectRowsProps,
    containerName: string
): Element {
    const callback = projectRowsProps.setTitleCallback({containerName})
    return <button onClick={callback}>更新</button>
}

function clearNonPortNodes(reactNodes: ReactNode[]): void {
    reactNodes.map((
        reactNode: ReactNode,
        reactNodeIndex: number
    ): ReactNode => {
        if (reactNodeIndex === 2) {
            return reactNode
        }
        return ''
    })
}

function projectsStateFlatMapCallback(projectRowsProps: ProjectRowsProps) {
    return (projectsContainer: ProjectsContainer, index: number) => {
        const ports: string[] = projectsContainer.port.split(',')
        return ports.map((port: string, portIndex: number): Element => {
            const dynamicIndex = `${index}-${port}`
            const reactNodes: ReactNode[] = [
                projectsContainer.projectName,
                projectsContainer.branchName,
                port,
                projectsContainer.createdAt,
                projectsContainer.state,
                projectsContainer.title,
                getLink(projectsContainer.state, port, projectRowsProps),
                getSetTitleClick(projectRowsProps, projectsContainer.containerName)
            ]
            if (portIndex !== 0) {
                clearNonPortNodes(reactNodes)
            }
            return <tr key={dynamicIndex}>
                <Rows reactNodes={reactNodes}/>
            </tr>
        })
    }
}

const ProjectsRows = (projectRowsProps: ProjectRowsProps): Element => {
    const projectsState = projectRowsProps.state
    return <tbody className='tbody'>
    {projectsState.flatMap(projectsStateFlatMapCallback(projectRowsProps))}
    </tbody>;
}
export default ProjectsRows
