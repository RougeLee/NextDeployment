class PlaceholderHandler {
    constructor(containersBunch, containerInfoArray) {
        this.containerListBunch = containersBunch
        this.parseContainerInfo(containerInfoArray)
    }

    main() {
        if (this.isOtherList()) {
            this.pushOtherContainerList()
            return
        }
        this.settingTitle()
        this.pushProjectsContainerList()
    }

    parseContainerInfo(containerInfoArray) {
        for (const placeholderEnumIndex in containerInfoArray) {
            const containerInfo = containerInfoArray[placeholderEnumIndex]
            switch (placeholderEnumIndex) {
                case DOCKER_PS_PLACEHOLDER_ENUM[PLACEHOLDER_NAME]:
                    this.containerName = containerInfo
                    break
                case DOCKER_PS_PLACEHOLDER_ENUM[PLACEHOLDER_PORTS]:
                    this.initPlaceholderPort(containerInfo)
                    break
                case DOCKER_PS_PLACEHOLDER_ENUM[PLACEHOLDER_CREATED]:
                    this.initPlaceholderCreatedAt(containerInfo)
                    break
                case DOCKER_PS_PLACEHOLDER_ENUM[PLACEHOLDER_STATE]:
                    this.state = containerInfo
                    break
                case DOCKER_PS_PLACEHOLDER_ENUM[PLACEHOLDER_IMAGE]:
                    this.image = containerInfo
                    break
            }
        }
    }

    isOtherList() {
        if (!this.confirmProjectsContainerList()) {
            return true
        }
        return !this.settingProjectNameAndBranchName()
    }

    confirmProjectsContainerList() {
        return this.image.includes(`/${PROJECTS_KEY_WORD}/`)
    }

    settingProjectNameAndBranchName() {
        const parts = this.image.split('/')
        const projectsIndex = parts.indexOf(PROJECTS_KEY_WORD) + 1
        const imageNameIndex = parts.length - 1
        if (projectsIndex === 0 || imageNameIndex < projectsIndex) {
            return false
        }
        this.projectName = parts[projectsIndex]
        this.branchName = parts.slice(projectsIndex + 1, imageNameIndex).join('/')
        return true
    }

    settingTitle() {
        this.title = this.containerListBunch[TITLE_LIST_GET_ALL][this.containerName] ?? '給這項目命名吧'
    }

    pushOtherContainerList() {
        this.pushContainerList(OTHER_CONTAINER_LIST, this.getOtherContainerList())
    }

    pushProjectsContainerList() {
        this.pushContainerList(PROJECTS_CONTAINER_LIST, this.getProjectsContainerList())
    }

    pushContainerList(pushType, listType) {
        this.containerListBunch[pushType].push(listType)
    }

    getOtherContainerList() {
        const containerName = this.containerName
        const port = this.port
        const createdAt = this.createdAt
        const state = this.state
        return {containerName, port, createdAt, state}
    }

    getProjectsContainerList() {
        const containerName = this.containerName
        const projectName = this.projectName
        const branchName = this.branchName
        const port = this.port
        const title = this.title
        const createdAt = this.createdAt
        const state = this.state
        return {containerName, projectName, branchName, port, title, createdAt, state}
    }

    initPlaceholderPort(ports) {
        const portsArray = ports.replace(/\/tcp| /g, '').split(',')
        const portArray = []
        for (const portsInfo of portsArray) {
            let portsSplit = portsInfo.split(':')
            if (portsSplit.length !== 2) {
                continue
            }
            portsSplit = portsSplit[1]
            portsSplit = portsSplit.split('->')
            if (portsSplit.length !== 2) {
                continue
            }
            portArray.push(parseInt(portsSplit[0]))
        }
        portArray.sort((a, b) => a - b)
        this.port = portArray.join(',')
    }

    initPlaceholderCreatedAt(created) {
        this.createdAt = moment(created, 'YYYY-MM-DD HH:mm:ss ZZ')
            .format('YYYY/MM/DD HH:mm')
    }
}

function execDockerPs() {
    return execSync(DOCKER_PS_CMD)
}

function analyzeContainerList(dockerPsInfoArray, containersBunch) {
    for (const containerInfo of dockerPsInfoArray) {
        const containerInfoArray = containerInfo.split(DOCKER_PS_SEPARATOR)
        if (containerInfoArray.length !== DOCKER_PS_PLACEHOLDER_TUPLES_LENGTH) {
            continue
        }
        new PlaceholderHandler(containersBunch, containerInfoArray).main()
    }
}

function getDockerPsPlaceholderEnum() {
    return Object.fromEntries(
        DOCKER_PS_PLACEHOLDER_TUPLES.map(
            (value, index) => [value, index.toString()]
        )
    )
}

function getDockerPsCMD() {
    let docker_ps_format = undefined
    for (const placeholder of DOCKER_PS_PLACEHOLDER_TUPLES) {
        docker_ps_format = docker_ps_format === undefined ?
            `{{.${placeholder}}}` :
            `${docker_ps_format}${DOCKER_PS_SEPARATOR}{{.${placeholder}}}`
    }
    return `docker ps -a --format '${docker_ps_format}'`
}

const moment = require('moment')
const {execSync} = require("child_process")
const {ContainerList} = require("../types/ContainerList");
const PLACEHOLDER_NAME = 'Names'
const PLACEHOLDER_PORTS = 'Ports'
const PLACEHOLDER_CREATED = 'CreatedAt'
const PLACEHOLDER_STATE = 'State'
const PLACEHOLDER_IMAGE = 'Image'
const DOCKER_PS_PLACEHOLDER_TUPLES = [
    PLACEHOLDER_NAME,
    PLACEHOLDER_PORTS,
    PLACEHOLDER_CREATED,
    PLACEHOLDER_STATE,
    PLACEHOLDER_IMAGE,
]
const DOCKER_PS_PLACEHOLDER_TUPLES_LENGTH = DOCKER_PS_PLACEHOLDER_TUPLES.length
const DOCKER_PS_PLACEHOLDER_ENUM = getDockerPsPlaceholderEnum()
const DOCKER_PS_SEPARATOR = ':-:'
const DOCKER_PS_CMD = getDockerPsCMD()
const PROJECTS_CONTAINER_LIST = ContainerList.ProjectsContainerList
const OTHER_CONTAINER_LIST = ContainerList.OtherContainerList
const TITLE_LIST_GET_ALL = ContainerList.TitleListGetAll
const PROJECTS_KEY_WORD = 'projects'

module.exports = {
    execDockerPs,
    analyzeContainerList,
    PROJECTS_CONTAINER_LIST,
    OTHER_CONTAINER_LIST,
    TITLE_LIST_GET_ALL,
}
