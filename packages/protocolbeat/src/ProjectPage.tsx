import { useParams } from 'react-router-dom'
import { MultiView } from './multi-view/MultiView'
import { PanelId } from './multi-view/store'
import { CodePanel } from './panel-code/CodePanel'
import { ListPanel } from './panel-list/ListPanel'
import { NodesPanel } from './panel-nodes/NodesPanel'
import { PreviewPanel } from './panel-preview/PreviewPanel'
import { ValuesPanel } from './panel-values/ValuesPanel'

export function ProjectPage() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }

  return <MultiView project={project} panelBodyElement={Panel} />
}

const PANELS = {
  list: ListPanel,
  values: ValuesPanel,
  nodes: NodesPanel,
  code: CodePanel,
  preview: PreviewPanel,
}

export function Panel(props: { kind: PanelId }) {
  const Component = PANELS[props.kind]
  return <Component />
}
