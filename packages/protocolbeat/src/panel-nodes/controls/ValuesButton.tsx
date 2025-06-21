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
  const disabled = !isSingleSelected || !hasAnyFields

  const visibleFields = selectedNode?.fields.filter(
    (field) => !selectedNode.hiddenFields.includes(field.name),
  )

  const fieldStat = selectedNode
    ? ` (${visibleFields?.length ?? 0}/${selectedNode.fields.length})`
    : undefined

  return (
    <ValuesDialog.Root>
      <ValuesDialog.Trigger disabled={disabled}>
        Values
        {fieldStat}
      </ValuesDialog.Trigger>
      {selectedNode && <ValuesDialog.Body node={selectedNode} />}
    </ValuesDialog.Root>
  )
}
