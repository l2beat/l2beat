import { useState } from 'react'
import type { Field } from '../../store/State'

export function FieldsList({
  fields,
  name,
  onChange,
  isHidden,
}: { fields: Field[]; name: string; onChange: () => void; isHidden: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const hasManyFields = fields.length > 1

  return (
    <div>
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          id={`${name}-checkbox`}
          onChange={onChange}
          checked={!isHidden}
          className="size-3 rounded border-coffee-400 bg-coffee-700"
        />
        <label htmlFor={`${name}-checkbox`} className="text-sm">
          {name}
        </label>
        {hasManyFields && (
          <>
            <span className="text-sm">({fields.length})</span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-xs"
            >
              {isCollapsed ? '⬇️' : '⬆️'}
            </button>
          </>
        )}
      </div>
      {!isCollapsed && (
        <div className="flex flex-col pl-4 text-coffee-200 text-sm">
          {fields.map((field) => (
            <span
              key={field.name}
              className="overflow-wrap-break-word overflow-x-auto whitespace-nowrap font-light text-sm"
            >
              - {field.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
