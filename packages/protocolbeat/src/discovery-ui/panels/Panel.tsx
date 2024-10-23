import { PanelId } from '../multi-view/store'
import { EmptyPanel } from './EmptyPanel'
import { ListPanel } from './ListPanel'

const PANELS = {
  list: ListPanel,
  values: EmptyPanel,
  nodes: EmptyPanel,
  code: EmptyPanel,
  preview: EmptyPanel,
}

export function Panel(props: { kind: PanelId }) {
  const Component = PANELS[props.kind]
  return <Component />
}
