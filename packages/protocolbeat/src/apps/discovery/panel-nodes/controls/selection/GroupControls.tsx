import { useEffect, useRef, useState } from 'react'
import { IconGroup } from '../../../../../icons/IconGroup'
import { IconUngroup } from '../../../../../icons/IconUngroup'
import { useIsomorphicKeys } from '../../../hooks/useIsomorphicKeys'
import { useStore } from '../../store/store'
import { ToolbarButton } from '../ToolbarButton'

export function GroupControls() {
  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const groupSelected = useStore((state) => state.groupSelected)
  const ungroupSelected = useStore((state) => state.ungroupSelected)
  const { altKey } = useIsomorphicKeys()

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
        <ToolbarButton
          label="Group"
          shortcut={[altKey, 'G']}
          onClick={() => groupSelected()}
        >
          <IconGroup />
        </ToolbarButton>
      )}
      {selectedGroup && (
        <GroupNameInput
          key={`${selectedGroup.id}-${selectedGroup.name}`}
          id={selectedGroup.id}
          name={selectedGroup.name}
        />
      )}
      {canUngroup && (
        <ToolbarButton
          label="Ungroup"
          shortcut={[altKey, 'Shift', 'G']}
          onClick={() => ungroupSelected()}
        >
          <IconUngroup />
        </ToolbarButton>
      )}
    </>
  )
}

function GroupNameInput({ id, name }: { id: string; name: string }) {
  const renameGroup = useStore((state) => state.renameGroup)
  const [value, setValue] = useState(name)

  // Clicking the viewport changes the selection and unmounts this input before
  // onBlur fires, so commit on unmount too. The ref keeps the cleanup closure
  // pointed at the latest typed value rather than the value at mount.
  const commitRef = useRef<() => void>(() => {})
  commitRef.current = () => {
    const trimmed = value.trim()
    if (trimmed.length > 0 && trimmed !== name) {
      renameGroup(id, trimmed)
    } else {
      setValue(name)
    }
  }
  useEffect(() => () => commitRef.current(), [])

  return (
    <input
      value={value}
      aria-label="Group name"
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => commitRef.current()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          commitRef.current()
          event.currentTarget.blur()
        }
      }}
      className="w-32 self-stretch rounded-lg border border-coffee-600 bg-coffee-800 px-3 text-coffee-100 text-xs outline-hidden focus:border-coffee-400"
    />
  )
}
