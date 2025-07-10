import { useState } from 'react'
import { Checkbox } from '../../../components/Checkbox'
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
  let checkboxState: 'indeterminate' | boolean
  if (hiddenChildrenCount === 0) {
    checkboxState = true // All visible
  } else if (hiddenChildrenCount === totalChildrenCount) {
    checkboxState = false // All hidden
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
        <div className="mb-1 w-full border-coffee-200/50 border-b border-dashed" />
        <Checkbox checked={checkboxState} onClick={() => onToggle(field)} />
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
        <div className="mb-1 w-full border-coffee-200/50 border-b border-dashed" />
        <Checkbox checked={checkboxState} onClick={() => onToggle(field)} />
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
