import { useState } from 'react'
import type { ExpandedField } from './buildFieldTree'

export function FieldNode({
  field,
  hiddenFields,
  onToggle,
}: {
  field: ExpandedField
  hiddenFields: string[]
  onToggle: (field: ExpandedField) => void
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const childrenKeys = extractChildrenKeys(field)

  const hiddenChildrenCount = childrenKeys.filter((key) =>
    hiddenFields.includes(key),
  ).length
  const totalChildrenCount = childrenKeys.length

  // Determine checkbox state
  let checkboxState: 'checked' | 'unchecked' | 'indeterminate'
  if (hiddenChildrenCount === 0) {
    checkboxState = 'checked' // All visible
  } else if (hiddenChildrenCount === totalChildrenCount) {
    checkboxState = 'unchecked' // All hidden
  } else {
    checkboxState = 'indeterminate' // Some visible, some hidden
  }

  const toggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (field.type === 'simple') {
    return (
      <div className="flex gap-1 pl-1">
        <div>{field.property}</div>
        <div className="w-full border-coffee-200/50 border-b border-dashed"></div>
        <Checkbox state={checkboxState} onClick={() => onToggle(field)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-1">
        {isCollapsed ? '▼' : '▲'}
        <div onClick={toggle} className="cursor-pointer hover:underline">
          {field.property}
        </div>
        <div className="w-full border-coffee-200/50 border-b border-dashed"></div>
        <Checkbox state={checkboxState} onClick={() => onToggle(field)} />
      </div>
      {!isCollapsed && (
        <div className="ml-1 flex flex-col border-coffee-200/50 border-l pl-2">
          {field.value.map((child) => (
            <FieldNode
              key={child.property}
              field={child}
              hiddenFields={hiddenFields}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function extractChildrenKeys(field: ExpandedField): string[] {
  if (field.type === 'simple') {
    return [field.fullKey]
  }

  return field.value.flatMap(extractChildrenKeys)
}

type CheckboxProps = {
  state: 'checked' | 'unchecked' | 'indeterminate'
  onClick: () => void
}

function Checkbox(props: CheckboxProps) {
  return (
    <div
      className="flex size-4 cursor-pointer items-center justify-center border-coffee-400 bg-coffee-700 hover:bg-coffee-700/50"
      onClick={() => props.onClick()}
    >
      {props.state === 'checked' && <CheckedTick />}
      {props.state === 'indeterminate' && <Indeterminate />}
      {props.state === 'unchecked' && <span className="w-4"></span>}
    </div>
  )
}

function CheckedTick() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="fill-none stroke-coffee-200"
    >
      <path d="M2.5 8.5L6.5 12.5L13.5 4" strokeWidth="2" />
    </svg>
  )
}

function Indeterminate() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="fill-none stroke-coffee-200"
    >
      <line x1="3" y1="8" x2="13" y2="8" strokeWidth="2" />
    </svg>
  )
}
