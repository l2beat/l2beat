import { useQuery } from '@tanstack/react-query'
import { type JSX, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../../api/api'
import { Title } from '../../components/Title'
import { IS_READONLY } from '../../config/readonly'
import { findSelected } from '../../utils/findSelected'
import { MultiView } from './multi-view/MultiView'
import type { PanelId } from './multi-view/store'
import { CodePanel } from './panel-code/CodePanel'
import { ConfigPanel } from './panel-config/ConfigPanel'
import { ListPanel } from './panel-list/ListPanel'
import { NodesPanel } from './panel-nodes/NodesPanel'
import { PreviewPanel } from './panel-preview/PreviewPanel'
import { TemplatePanel } from './panel-template/TemplatePanel'
import { TerminalPanel } from './panel-terminal/TerminalPanel'
import { ValuesPanel } from './panel-values/ValuesPanel'
import { usePanelStore } from './store/panel-store'

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
  const selectedAddress = usePanelStore((state) => state.selected)
  useEffect(() => {
    if (response.data) {
      // Check if the currently selected contract still exists in the new data
      const currentlySelectedStillExists = findSelected(
        response.data.entries,
        selectedAddress,
      )

      // Only reset to the first contract if no contract is selected
      // or the selected contract no longer exists
      if (!currentlySelectedStillExists) {
        const first = response.data.entries[0]?.initialContracts[0]?.address
        select(first)
      }
    }
  }, [response.data, select, selectedAddress])

  return (
    <>
      <Title title={`DiscoUI - ${project}`} />
      <MultiView project={project} panelBodyElement={Panel} />
    </>
  )
}

const PANELS: Record<PanelId, () => JSX.Element> = {
  list: ListPanel,
  values: ValuesPanel,
  nodes: NodesPanel,
  code: CodePanel,
  preview: PreviewPanel,
  terminal: TerminalPanel,
  template: TemplatePanel,
  config: ConfigPanel,
}

const READONLY_PANELS: Record<
  Exclude<PanelId, 'terminal'>,
  () => JSX.Element
> = {
  list: ListPanel,
  values: ValuesPanel,
  nodes: NodesPanel,
  preview: PreviewPanel,
  code: CodePanel,
  template: TemplatePanel,
  config: ConfigPanel,
}

function Panel(props: { kind: PanelId }) {
  const Component = IS_READONLY
    ? props.kind in READONLY_PANELS
      ? READONLY_PANELS[props.kind as Exclude<PanelId, 'terminal'>]
      : ListPanel
    : PANELS[props.kind]
  return <Component />
}
