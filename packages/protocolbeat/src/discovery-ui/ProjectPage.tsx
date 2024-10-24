import { useParams } from 'react-router-dom'
import { EmptyPanel } from './EmptyPanel'
import { ListPanel } from './list/ListPanel'
import { MultiView } from './multi-view/MultiView'
import { PanelId } from './multi-view/store'
import { ValuesPanel } from './values/ValuesPanel'

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
  nodes: EmptyPanel,
  code: EmptyPanel,
  preview: EmptyPanel,
}

export function Panel(props: { kind: PanelId }) {
  const Component = PANELS[props.kind]
  return <Component />
}
