import { useMemo } from 'react'
import { useStore } from '../store/store'
import { IconControlBars } from './icons/IconControlBars'
import { ValuesDialog } from './node-values/ValuesDialog'

export function ValuesButton({ className }: { className?: string }) {
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

  const fieldStat =
    selectedNode && rest.length === 0
      ? `${visibleFields?.length ?? 0}/${selectedNode.fields.length}`
      : 'N/A'

  return (
    <ValuesDialog.Root>
      <ValuesDialog.Trigger
        disabled={disabled}
        className={className}
        title="Values visibility"
        ariaLabel="Edit values visibility"
      >
        <span className="flex items-center justify-center gap-2 text-center">
          <span className="text-coffee-100">
            <IconControlBars />
          </span>
          <span className="text-[11px] text-coffee-300 leading-none">
            {fieldStat}
          </span>
        </span>
      </ValuesDialog.Trigger>
      {selectedNode && <ValuesDialog.Body node={selectedNode} />}
    </ValuesDialog.Root>
  )
}
