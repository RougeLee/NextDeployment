import Element = React.JSX.Element
import {useEffect, useState} from 'react'
import {
    SetTitle,
    ProjectsContainer,
    ProjectsUseState,
    ProjectsSetState,
    setTitleCallback,
    SetStates, OtherUseState
} from '@/types/info'
import {ContainerList} from '@/types/ContainerList'
import ProjectsThead from '@/components/ProjectsThead'
import ProjectsRows from '@/components/ProjectsRows'
import OtherThead from '@/components/OtherThead'
import OtherRows from '@/components/OtherRows'

function getSetTitleCallback(projectsSetState: ProjectsSetState): setTitleCallback {
    return (setTitle: SetTitle) => {
        return async () => {
            await updateTitle(setTitle, projectsSetState)
        }
    }
}

async function updateTitle(setTitle: SetTitle, projectsSetState: ProjectsSetState): Promise<void> {
    let title = prompt('請輸入新的標題')
    if (!title) {
        alert('標題尚未更新.')
        return
    }
    title = title.trim()
    const {containerName} = setTitle
    const method = 'POST'
    const headers = {'Content-Type': 'application/json'}
    const body = JSON.stringify({containerName, title})
    const init = {method, headers, body}
    const response = await fetch(WEB_DEV_URL_API_INFO, init)
    if (!response.ok) {
        alert('更新失敗.')
        return
    }
    projectsSetState((previousList: ProjectsContainer[]) => {
        return previousList.map((item) => {
            if (item.containerName === containerName) {
                return {...item, title: title}
            }
            return item
        })
    })
    alert('更新成功.')
}

function settingSetStates(setStates: SetStates, result: object): void {
    Object.entries(ContainerList).forEach(([key]) => {
        const setStateFunctionName = `${key}SetState`
        const setState = setStates[setStateFunctionName]
        if (setState && typeof setState === 'function') {
            setState(result[key])
        }
    })
}

function callInfoAPI(setStates: SetStates): void {
    fetch(WEB_DEV_URL_API_INFO)
        .then((result: Response) => result.json())
        .then((result: object) => settingSetStates(setStates, result))
}

function index(): Element {
    const [
        projectsState,
        ProjectsContainerListSetState
    ] = useState<ProjectsUseState>([])
    const [
        otherState,
        OtherContainerListSetState
    ] = useState<OtherUseState>([])
    useEffect(() => {
        document.body.style.backgroundColor = '#00FF004C';
        callInfoAPI({ProjectsContainerListSetState, OtherContainerListSetState})
    }, [])
    return <div className='container mt-5'>
        <h1 className='fw-bolder text-white'>Web Frontend Dev Website</h1>
        <h5 className='fw-bolder text-white mt-5'>專案站點列表</h5>
        <table className='table table-striped table-bordered bg-white'>
            <ProjectsThead/>
            <ProjectsRows
                state={projectsState}
                setTitleCallback={getSetTitleCallback(ProjectsContainerListSetState)}
                url={WEB_DEV_URL}/>
        </table>
        <h5 className='fw-bolder text-white mt-5'>其他容器列表</h5>
        <table className='table table-striped table-bordered  bg-white'>
            <OtherThead/>
            <OtherRows otherState={otherState}/>
        </table>
    </div>
}

const WEB_DEV_URL = process.env.NEXT_PUBLIC_WEB_DEV_URL || 'http://localhost:3000'
const WEB_DEV_URL_API_INFO = `${WEB_DEV_URL}/api/info`

export default index
