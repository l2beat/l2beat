import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from './api/api'
import { MultiView } from './multi-view/MultiView'
import type { PanelId } from './multi-view/store'
import { CodePanel } from './panel-code/CodePanel'
import { ListPanel } from './panel-list/ListPanel'
import { NodesPanel } from './panel-nodes/NodesPanel'
import { PreviewPanel } from './panel-preview/PreviewPanel'
import { TerminalPanel } from './panel-terminal/TerminalPanel'
import { ValuesPanel } from './panel-values/ValuesPanel'
import { usePanelStore } from './store/store'

export function ProjectPage() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }
  const response = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const select = usePanelStore((state) => state.select)
  useEffect(() => {
    if (response.data) {
      const first = response.data.chains[0]?.initialContracts[0]?.address
      select(first)
    }
  }, [response.data, select])

  return <MultiView project={project} panelBodyElement={Panel} />
}

const PANELS: Record<PanelId, () => JSX.Element> = {
  list: ListPanel,
  values: ValuesPanel,
  nodes: NodesPanel,
  code: CodePanel,
  preview: PreviewPanel,
  terminal: TerminalPanel,
}

function Panel(props: { kind: PanelId }) {
  const Component = PANELS[props.kind]
  return <Component />
}
