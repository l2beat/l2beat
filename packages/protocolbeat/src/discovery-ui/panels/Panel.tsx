import { PanelId } from '../multi-view/store'
import { EmptyPanel } from './EmptyPanel'
import { ListPanel } from './ListPanel'
import { ValuesPanel } from './ValuesPanel'

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
