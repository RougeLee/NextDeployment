import {OtherContainer, OtherRowsProps} from '@/types/info'
import {ReactNode} from 'react'
import {Rows} from './Elements'

const OtherRowsMapCallback = (otherContainer: OtherContainer, index: number) => {
    const ports: string[] = otherContainer.port.split(',')
    return ports.map((port: string, portIndex: number) => {
        const dynamicIndex = `${index}-${port}`
        const containerName = otherContainer.containerName
        let createdAt = otherContainer.createdAt
        let state = otherContainer.state
        if (portIndex !== 0) {
            createdAt = ''
            state = ''
        }
        const reactNodes: ReactNode[] = [
            containerName,
            port,
            createdAt,
            state
        ]
        return <tr key={dynamicIndex}>
            <Rows reactNodes={reactNodes}/>
        </tr>
    })
}
const OtherRows = (otherRowsProps: OtherRowsProps) => {
    return (
        <tbody className="tbody">
        {otherRowsProps.otherState.map(OtherRowsMapCallback)}
        </tbody>
    )
}
export default OtherRows
