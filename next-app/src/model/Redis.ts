import {getRedis} from '@/db/Redis'

const PROJECTS_CONTAINER_KEY = 'registry:projects-container-list'
const REDIS = getRedis()

export function projectsTitleGetAllAsync() {
    return hashGetAllAsync(PROJECTS_CONTAINER_KEY)
}

export function setProjectsTitle(
    containerName: string,
    title: string
) {
    return hashSet(PROJECTS_CONTAINER_KEY, containerName, title)
}

function hashGetAllAsync(key: string) {
    return REDIS.hgetall(key)
}

function hashSet(key: string, field: string, value: any) {
    return REDIS.hset(key, field, value)
}
