import { useMemo } from 'react'
import { useStore } from '../store/store'
import { ValuesDialog } from './node-values/ValuesDialog'

export function ValuesButton() {
  const [selected, ...rest] = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selected),
    [nodes, selected],
  )

  const isSingleSelected =
    selectedNode && rest.length === 0 && selectedNode.fields.length > 0
  const hasAnyFields = selectedNode && selectedNode.fields.length > 0
  const disabled = !isSingleSelected && !hasAnyFields

  return (
    <ValuesDialog.Root>
      <ValuesDialog.Trigger disabled={disabled} />
      {selectedNode && <ValuesDialog.Body node={selectedNode} />}
    </ValuesDialog.Root>
  )
}
