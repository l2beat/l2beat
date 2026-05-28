import { useState } from 'react'
import { IconFolder } from '../../../../icons/IconFolder'
import { cn } from '../../../../utils/cn'
import { usePanelStore } from '../../store/panel-store'
import { useStore } from '../store/store'
import { ControlDropdownButton } from './ControlDropdownButton'
import { ManageEntrypointsDialog } from './ManageEntrypointsDialog'

export function EntrypointButton({ className }: { className?: string }) {
  const [manageOpen, setManageOpen] = useState(false)
  const entrypointGroups = useStore((state) => state.entrypointGroups)
  const collapsedEntrypointGroups = useStore(
    (state) => state.collapsedEntrypointGroups,
  )
  const toggleEntrypointGroup = useStore((state) => state.toggleEntrypointGroup)
  const selectedAddress = usePanelStore((state) => state.selected)

  const options = entrypointGroups.map((group) => {
    const isCollapsed = collapsedEntrypointGroups.includes(group.id)
    return {
      label: isCollapsed ? `Expand ${group.label}` : `Collapse ${group.label}`,
      count: group.contractCount + group.eoaCount,
      icon: <IconFolder className="size-3.5" />,
      onSelect: () => toggleEntrypointGroup(group.id),
    }
  })
  options.push({
    label: 'Manage entrypoints...',
    onSelect: () => setManageOpen(true),
    disabled: !selectedAddress,
  })

  return (
    <>
      <ControlDropdownButton
        label="Entrypoints"
        icon={<IconFolder className="size-3.5" />}
        className={cn('px-3 py-2.5', className)}
        options={options}
      />
      <ManageEntrypointsDialog open={manageOpen} onOpenChange={setManageOpen} />
    </>
  )
}
