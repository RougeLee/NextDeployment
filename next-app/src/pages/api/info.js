import moment from "moment"

function getDockerPsInfoArray() {
    const dockerPsInfo = execDockerPs()
    return dockerPsInfo.toString('utf-8').split('\n')
}

async function getContainersBunchAsync(ProjectsContainerList, OtherContainerList) {
    return {
        [PROJECTS_CONTAINER_LIST]: ProjectsContainerList,
        [OTHER_CONTAINER_LIST]: OtherContainerList,
        [TITLE_LIST_GET_ALL]: await projectsTitleGetAllAsync() ?? {}
    }
}

function containerCompare(a, b) {
    if (a.state === CONTAINER_STATE_SORT_FIRST) {
        if (b.state === CONTAINER_STATE_SORT_FIRST) {
            return portCompare(a, b)
        }
        return -1
    }
    if (b.state === CONTAINER_STATE_SORT_FIRST) {
        return 1
    }
    let stateOrder = a.state.localeCompare(b.state)
    if (stateOrder === 0) {
        return portCompare(a, b)
    }
    return stateOrder
}

function portCompare(a, b) {
    return getFirstPort(a) - getFirstPort(b)
}

function getFirstPort(nextContainer) {
    const {port} = nextContainer
    return port.split(',')[0]
}

async function getHandler(res) {
    const ProjectsContainerList = []
    const OtherContainerList = []
    analyzeContainerList(
        getDockerPsInfoArray(),
        await getContainersBunchAsync(ProjectsContainerList, OtherContainerList)
    )
    ProjectsContainerList.sort(containerCompare)
    OtherContainerList.sort(containerCompare)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ProjectsContainerList, OtherContainerList}))
}

async function postHandler(req, res) {
    const body = req.body
    const {containerName, title} = body
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    if (containerName === undefined || title === undefined) {
        res.end(JSON.stringify({containerName, title}))
        return
    }
    await setProjectsTitle(containerName, title)
    res.end('done.')
}

export default async (req, res) => {
    await Cors(req, res, CORS_OPTIONS)
    try {
        switch (req.method) {
            case 'GET':
                await getHandler(res)
                break
            case 'POST':
                await postHandler(req, res)
                break
            default:
                res.end(`method: ${req.method} not support.`)
        }
    } catch (e) {
        const nowDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
        const errorPrefix = `${nowDateTime} [ERROR]: `
        console.error(`${errorPrefix}${e.message}\n${e.stack}`)
        res.status(500).end('Internal Server Error.')
    }
}

const Cors = require('nextjs-cors').default
const {
    projectsTitleGetAllAsync,
    setProjectsTitle
} = require('../../model/Redis')
const {
    execDockerPs,
    analyzeContainerList,
    PROJECTS_CONTAINER_LIST,
    OTHER_CONTAINER_LIST,
    TITLE_LIST_GET_ALL
} = require('../../helper/docker-ps')

const CORS_OPTIONS = {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], origin: '*', credentials: true,
}
const CONTAINER_STATE_SORT_FIRST = 'running'
