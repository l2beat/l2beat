import type { Field } from '../api/types'
import { FieldValueDisplay } from './FieldValueDisplay'

export interface FieldDisplayProps {
  field: Field
}

export function FieldDisplay({ field }: FieldDisplayProps) {
  const tags = getFieldTags(field)
  return (
    <li className="mb-1 truncate text-sm last:mb-0">
      <div className="flex flex-wrap gap-2 px-5 py-1 font-bold text-xs">
        {field.name}
        {tags.map((x, i) => (
          <span
            className="bg-aux-blue px-1 text-[10px] text-black uppercase"
            key={i}
          >
            {x}
          </span>
        ))}
      </div>
      {field.description && (
        <div className="-mt-0.5 px-5 pb-1 font-serif italic">
          {field.description}
        </div>
      )}
      <div className="overflow-x-auto bg-coffee-900 px-10 py-0.5">
        <FieldValueDisplay topLevel value={field.value} />
      </div>
    </li>
  )
}

function getFieldTags(field: Field) {
  const tags: string[] = []
  if (field.handler) {
    tags.push(`handler:${field.handler.type}`)
  }
  if (field.ignoreInWatchMode) {
    tags.push('ignore:watchmode')
  }
  if (field.ignoreRelatives) {
    tags.push('ignore:relatives')
  }
  if (field.severity) {
    tags.push(`severity:${field.severity.toLowerCase()}`)
  }
  return tags
}
