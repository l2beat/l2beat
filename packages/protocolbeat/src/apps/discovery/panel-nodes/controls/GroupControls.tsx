import { useState } from 'react'
import { IconGroup } from '../../../../icons/IconGroup'
import { IconUngroup } from '../../../../icons/IconUngroup'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function GroupControls() {
  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const groupSelected = useStore((state) => state.groupSelected)
  const ungroupSelected = useStore((state) => state.ungroupSelected)

  const selectedSet = new Set(selected)
  const canGroup = selected.length > 1
  const canUngroup = nodes.some(
    (node) => selectedSet.has(node.id) && node.subnodes.length > 0,
  )
  const onlySelected =
    selected.length === 1
      ? nodes.find((node) => node.id === selected[0])
      : undefined
  const selectedGroup =
    onlySelected && onlySelected.subnodes.length > 0 ? onlySelected : undefined

  return (
    <>
      {canGroup && (
        <ControlButton
          title="Group"
          aria-label="Group"
          onClick={() => groupSelected()}
          className="px-3 py-2.5"
        >
          <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
            <IconGroup />
          </span>
        </ControlButton>
      )}
      {selectedGroup && (
        <GroupNameInput
          key={`${selectedGroup.id}-${selectedGroup.name}`}
          name={selectedGroup.name}
        />
      )}
      {canUngroup && (
        <ControlButton
          title="Ungroup"
          aria-label="Ungroup"
          onClick={() => ungroupSelected()}
          className="px-3 py-2.5"
        >
          <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
            <IconUngroup />
          </span>
        </ControlButton>
      )}
    </>
  )
}

function GroupNameInput({ name }: { name: string }) {
  const renameSelectedGroup = useStore((state) => state.renameSelectedGroup)
  const [value, setValue] = useState(name)

  function commit() {
    const trimmed = value.trim()
    if (trimmed.length > 0 && trimmed !== name) {
      renameSelectedGroup(trimmed)
    } else {
      setValue(name)
    }
  }

  return (
    <input
      value={value}
      aria-label="Group name"
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          commit()
          event.currentTarget.blur()
        }
      }}
      className="w-32 self-stretch rounded-lg border border-coffee-600 bg-coffee-800 px-3 text-coffee-100 text-xs outline-none focus:border-coffee-400"
    />
  )
}
