import {Dispatch, SetStateAction} from 'react'

export interface ProjectRowsProps {
    state: ProjectsUseState
    setTitleCallback: setTitleCallback
    url: string
}

export interface OtherRowsProps {
    otherState: OtherUseState
}

export type SetStates = { [key: string]: Dispatch<SetStateAction<[]>> }

export type SetTitle = {
    containerName: string
}
export type setTitleCallback = (setTitle: SetTitle) => () => Promise<void>
export type ProjectsContainer = {
    containerName: string
    projectName: string
    branchName: string
    port: string
    title: string
    createdAt: string
    state: string
}
export type ProjectsUseState = ProjectsContainer[]
export type ProjectsSetState = Dispatch<SetStateAction<ProjectsUseState>>
export type OtherContainer = {
    containerName: string
    port: string
    createdAt: string
    state: string
}
export type OtherUseState = OtherContainer[]
