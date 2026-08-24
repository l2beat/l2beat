import clsx from 'clsx'
import { useState } from 'react'
import { Checkbox } from '../../../../../components/Checkbox'
import { IconEyeClosed } from '../../../../../icons/IconEyeClosed'
import { IconFoldVertical } from '../../../../../icons/IconFoldVertical'
import { IconUnfoldVertical } from '../../../../../icons/IconUnfoldVertical'
import type { ExpandedField } from './buildFieldTree'
import {
  type DisplayedFieldState,
  type FieldState,
  getFieldState,
  type ValueVisibility,
} from './fieldState'

export function FieldNode({
  field,
  visibility,
  subsumedBy,
  onSetState,
}: {
  field: ExpandedField
  visibility: ValueVisibility
  // Path of the enclosing group already drawn as one row, if any. Its members
  // share that row, so they cannot expand or compress on their own.
  subsumedBy?: string
  onSetState: (
    field: ExpandedField,
    state: FieldState,
    subsumedBy?: string,
  ) => void
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const state = getFieldState(field, visibility, subsumedBy)
  const childSubsumedBy =
    subsumedBy ?? (state === 'compress' ? field.fullKey : undefined)

  // Only a group that is not already part of a compressed row has three
  // things it can do. A single value, or anything inside such a row, is just
  // shown or hidden.
  const control =
    field.type === 'complex' && subsumedBy === undefined ? (
      <StateToggle
        state={state}
        onSelect={(next) => onSetState(field, next, subsumedBy)}
      />
    ) : (
      <Checkbox
        checked={toChecked(state)}
        onClick={() =>
          onSetState(field, state === 'off' ? 'on' : 'off', subsumedBy)
        }
      />
    )

  if (field.type === 'simple') {
    return (
      <div className="flex items-center gap-1 pl-1">
        <div className={clsx(state === 'off' && 'text-coffee-400')}>
          {field.property}
        </div>
        <div className="mb-1 w-full border-coffee-200/50 border-b border-dashed" />
        {control}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        {isCollapsed ? '▼' : '▲'}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={clsx(
            'cursor-pointer hover:underline',
            state === 'off' && 'text-coffee-400',
          )}
        >
          {field.property}
        </div>
        <div className="mb-1 w-full border-coffee-200/50 border-b border-dashed" />
        {control}
      </div>
      {!isCollapsed && (
        <div className="ml-1 flex flex-col border-coffee-200/50 border-l pl-2">
          {field.value.map((child) => (
            <FieldNode
              key={child.property}
              field={child}
              visibility={visibility}
              subsumedBy={childSubsumedBy}
              onSetState={onSetState}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function toChecked(state: DisplayedFieldState): 'indeterminate' | boolean {
  if (state === 'off') return false
  if (state === 'mixed') return 'indeterminate'
  return true
}

const OPTIONS = [
  {
    state: 'on' as const,
    icon: <IconUnfoldVertical />,
    title: 'Show, one row per value',
  },
  {
    state: 'compress' as const,
    icon: <IconFoldVertical />,
    title: 'Show as one row linking to every value',
  },
  { state: 'off' as const, icon: <IconEyeClosed />, title: 'Hide' },
]

function StateToggle({
  state,
  onSelect,
}: {
  state: DisplayedFieldState
  onSelect: (state: FieldState) => void
}) {
  return (
    <div className="flex shrink-0 items-center border border-coffee-400">
      {OPTIONS.map((option) => (
        <button
          key={option.state}
          type="button"
          title={option.title}
          onClick={() => onSelect(option.state)}
          className={clsx(
            'flex size-4 items-center justify-center',
            option.state === state
              ? 'bg-autumn-300 text-black'
              : 'text-coffee-400 hover:bg-coffee-400/40',
          )}
        >
          {option.icon}
        </button>
      ))}
    </div>
  )
}
