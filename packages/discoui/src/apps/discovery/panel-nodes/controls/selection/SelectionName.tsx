import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/store'
import { selectOnlySelectedNode } from './selectOnlySelectedNode'

export function SelectionName() {
  const selectedCount = useStore((state) => state.selected.length)
  const onlySelected = useStore(selectOnlySelectedNode)

  if (onlySelected && onlySelected.subnodes.length > 0) {
    return (
      <GroupNameInput
        key={`${onlySelected.id}-${onlySelected.name}`}
        id={onlySelected.id}
        name={onlySelected.name}
      />
    )
  }

  const text = onlySelected?.name ?? `${selectedCount} selected`
  return (
    <span
      title={text}
      className="w-32 truncate px-2 font-medium text-coffee-200 text-xs"
    >
      {text}
    </span>
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
      title="Rename group"
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => commitRef.current()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          commitRef.current()
          event.currentTarget.blur()
        }
      }}
      className="h-8 w-32 rounded-lg border border-coffee-600 bg-coffee-800 px-2 font-medium text-coffee-200 text-xs outline-hidden focus:border-autumn-300"
    />
  )
}
