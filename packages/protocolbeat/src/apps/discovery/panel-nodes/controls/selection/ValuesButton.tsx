import { useStore } from '../../store/store'
import { IconControlBars } from '../icons/IconControlBars'
import { ValuesDialog } from './node-values/ValuesDialog'
import { selectOnlySelectedNode } from './selectOnlySelectedNode'

export function ValuesButton() {
  const selectedNode = useStore(selectOnlySelectedNode)
  const fieldCount = selectedNode?.fields.length ?? 0
  const visibleFieldCount =
    selectedNode?.fields.filter(
      (field) => !selectedNode.hiddenFields.includes(field.name),
    ).length ?? 0

  return (
    <ValuesDialog.Root>
      <ValuesDialog.Trigger label="Visible values" disabled={fieldCount === 0}>
        <IconControlBars />
        {fieldCount > 0 && (
          <span className="text-[11px] text-coffee-400 tabular-nums leading-none">
            {visibleFieldCount}/{fieldCount}
          </span>
        )}
      </ValuesDialog.Trigger>
      {selectedNode && <ValuesDialog.Body node={selectedNode} />}
    </ValuesDialog.Root>
  )
}
