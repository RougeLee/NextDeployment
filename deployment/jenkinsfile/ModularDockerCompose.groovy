//file:noinspection GroovyUnusedAssignment
//file:noinspection GroovyAssignabilityCheck
//file:noinspection GrUnresolvedAccess
//file:noinspection HttpUrlsUsage
//file:noinspection SpellCheckingInspection
@Library('ModularCICD@ARE/main') _
@Library('InfraCredentialProvider@dev/Rouge')

String nextJsImage = 'next-app'
ArrayList buildWorkflowArgsList = [
        [
                Image             : nextJsImage,
                DockerfileTemplate: 'next_js.StandaloneTemplate',
                ConfigFile        : 'config.env',
        ]
]
Map dockerComposeTopLevel = [
        version: '3.7',
]
ArrayList dockerComposeServices = []
dockerComposeServices << [
        ArtifactImage: nextJsImage,
        DeployTags   : ['NextJs'],
        DeployConfig : 'deploy.env',
        ServiceYaml  : 'next.yaml'
]
dockerComposeServices << [
        ArtifactImage: 'none',
        DeployTags   : ['Redis'],
        ServiceYaml  : 'redis.yaml'
]
Map DockerComposeMap = [
        DockerComposeTopLevel     : dockerComposeTopLevel,
        DockerComposeServices     : dockerComposeServices,
]
ApplyModuleArgMapPipeline(DockerComposeMap)
ModularArtifactPipeline {
    SCM = 'GIT'
    PROJECT_CODE = 'nextdev'
    GIT_CREDENTIALS_ID = 'JenkinsClone'
    DO_BUILD = true
    OPEN_BUILD_UI = true
    GIT_URL = 'https://github.com/RougeLee/NextDeployment.git'
    BUILD_WORK_FLOW_ARGS_LIST = buildWorkflowArgsList
    MODULE = 'DockerCompose'
    MODULE_ARG_MAP = DockerComposeMap
    BUILD_TYPE = 'Manual'
    BUILD_PLATFORM = 'docker'
    CODE_TYPE = 'artifact'
    ARTIFACT_TYPE = 'ci'
    OPADMIN_CREDENTIAL_ID = 'opadmin'
}
