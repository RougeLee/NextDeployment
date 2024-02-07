import {Property} from "csstype"
import TextAlign = Property.TextAlign
import ReactNode = React.ReactNode

export type ThCenterPrams = {
    reactNode: ReactNode
    textAlign?: TextAlign
    width?: string
}

export interface ColumnProps {
    columns: ThCenterPrams[]
}

export interface RowProps {
    reactNodes: ReactNode[]
}
