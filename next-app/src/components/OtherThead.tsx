import {Columns} from './Elements'
import {ThCenterPrams} from '@/types/Elements'

const otherColumns: ThCenterPrams[] = [
    {reactNode: '容器名稱', width: '40%'},
    {reactNode: 'Port', width: '10%'},
    {reactNode: '創建時間', width: '30%'},
    {reactNode: '運行狀態', width: '20%'}
]
const OtherThead = () =>
    <thead>
    <Columns columns={otherColumns}/>
    </thead>
export default OtherThead
