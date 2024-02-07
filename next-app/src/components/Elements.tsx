import Element = React.JSX.Element
import React from 'react'
import ReactNode = React.ReactNode
import {ThCenterPrams, ColumnProps, RowProps} from '@/types/Elements'

function thElement(thCenterPrams: ThCenterPrams, key: string | number): Element {
    const style = {
        width: thCenterPrams.width || 'auto',
        textAlign: thCenterPrams.textAlign || 'center'
    }
    return <th key={key} scope='col' style={style}>{thCenterPrams.reactNode}</th>
}

function tdElement(reactNode: ReactNode, key: string | number): Element {
    return <td key={key} scope='row' style={{textAlign: 'center'}}>{reactNode}</td>
}

export function Columns(columnProps: ColumnProps): Element {
    return <tr>
        {columnProps.columns.map(
            (thCenterPrams: ThCenterPrams, index: number) => thElement(thCenterPrams, index)
        )}
    </tr>
}

export function Rows(rowProps: RowProps): Element {
    return <>{rowProps.reactNodes.map(tdElement)}</>
}
