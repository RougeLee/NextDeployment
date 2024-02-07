import {Columns} from './Elements'
import {ThCenterPrams} from '@/types/Elements'

const projectColumns: ThCenterPrams[] = [
    {reactNode: '專案名稱', width: '10%'},
    {reactNode: '分支名稱', width: '10%'},
    {reactNode: 'Port', width: '5%'},
    {reactNode: '創建時間', width: '15%'},
    {reactNode: '運行狀態', width: '10%'},
    {reactNode: '標題', width: '30%'},
    {reactNode: '連結', width: '5%'},
    {reactNode: '設定標題', width: '10%'}
]
const ProjectsThead = () =>
    <thead>
    <Columns columns={projectColumns}/>
    </thead>
export default ProjectsThead
