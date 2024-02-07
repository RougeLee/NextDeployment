//file:noinspection GroovyUnusedAssignment
//file:noinspection GroovyAssignabilityCheck
//file:noinspection GrUnresolvedAccess
//file:noinspection HttpUrlsUsage
//file:noinspection SpellCheckingInspection
@Library('ModularCICD@main') _

ModularArtifactPipeline {
    SCM = 'GIT'
    PROJECT_CODE = 'nextdev'
    DO_BUILD = true
    OPEN_BUILD_UI = true
    GIT_URL = 'https://github.com/RougeLee/NextDeployment.git'
    BUILD_WORK_FLOW_ARGS_LIST = buildWorkflowArgsList
    MODULE = 'DockerCompose'
    MODULE_ARG_MAP = [:]
}
