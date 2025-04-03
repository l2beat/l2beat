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
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`${name}-checkbox`}
          onChange={onChange}
          checked={!isHidden}
          className="h-4 w-4 rounded border-coffee-400 bg-coffee-700"
        />
        <label
          htmlFor={`${name}-checkbox`}
          className="font-medium text-coffee-100"
        >
          {name}
        </label>
        {hasManyFields && (
          <>
            <span className="text-sm">({fields.length})</span>
            <button onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? '⬇️' : '⬆️'}
            </button>
          </>
        )}
      </div>
      {!isCollapsed && (
        <div className="flex flex-col pl-6 text-coffee-200 text-sm">
          {fields.map((field) => (
            <div key={field.name} className="hover:text-coffee-100">
              - {field.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
